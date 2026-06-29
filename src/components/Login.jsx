"use client"

import { useState, useEffect, useRef } from "react"
import apiService from "../services/api"
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa"

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")

    let animationFrameId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener("resize", handleResize)

    const cellSize = 30
    let cols = Math.floor(width / cellSize)
    let rows = Math.floor(height / cellSize)

    function createSnakeBody(startX, startY, length, direction) {
      const body = []
      for (let i = 0; i < length; i++) {
        body.push({
          x: startX - direction.x * i,
          y: startY - direction.y * i
        })
      }
      return body
    }

    let snakes = [
      {
        body: createSnakeBody(Math.floor(cols / 4), Math.floor(rows / 2), 12, { x: 1, y: 0 }),
        dir: { x: 1, y: 0 },
        food: { x: Math.floor(cols / 2), y: Math.floor(rows / 2) },
        color: "#7bb23c", // Green snake
        bellyColor: "#e3e4a2",
        spotColor: "#2a4e1d",
        eyeColor: "#1e70b8"
      },
      {
        body: createSnakeBody(Math.floor(cols / 2), Math.floor(rows / 4), 12, { x: 0, y: 1 }),
        dir: { x: 0, y: 1 },
        food: { x: Math.floor(cols / 3), y: Math.floor(rows * 2/3) },
        color: "#f97316", // Orange snake
        bellyColor: "#ffedd5",
        spotColor: "#7c2d12",
        eyeColor: "#10b981"
      },
      {
        body: createSnakeBody(Math.floor(cols * 3/4), Math.floor(rows * 3/4), 12, { x: -1, y: 0 }),
        dir: { x: -1, y: 0 },
        food: { x: Math.floor(cols * 2/3), y: Math.floor(rows / 3) },
        color: "#38bdf8", // Blue snake
        bellyColor: "#e0f2fe",
        spotColor: "#0369a1",
        eyeColor: "#ec4899"
      }
    ]

    let particles = []
    let cracks = []
    let fires = []

    function getRandomFoodPos() {
      return {
        x: Math.floor(Math.random() * (cols - 4)) + 2,
        y: Math.floor(Math.random() * (rows - 4)) + 2,
      }
    }

    function spawnExplosion(x, y, color) {
      for (let i = 0; i < 45; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 3 + Math.random() * 8
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          alpha: 1,
          size: 2 + Math.random() * 4
        })
      }
    }

    function generateCracks(startX, startY) {
      const lines = []
      const numMainBranches = 8 + Math.floor(Math.random() * 6)
      
      for (let i = 0; i < numMainBranches; i++) {
        const angle = (i / numMainBranches) * Math.PI * 2 + (Math.random() - 0.5) * 0.4
        let length = 80 + Math.random() * 180
        
        const endX = startX + Math.cos(angle) * length
        const endY = startY + Math.sin(angle) * length
        lines.push({ x1: startX, y1: startY, x2: endX, y2: endY, width: 2.5 + Math.random() * 2 })
        
        // Add tiny lateral sub-branches
        if (Math.random() > 0.3) {
          const subAngle = angle + (Math.random() - 0.5) * 1.2
          const subLength = length * 0.5
          lines.push({
            x1: endX,
            y1: endY,
            x2: endX + Math.cos(subAngle) * subLength,
            y2: endY + Math.sin(subAngle) * subLength,
            width: 1
          })
        }
      }
      return { lines, age: 0, maxAge: 160 } // stays for ~3.5 seconds
    }

    let lastTime = 0
    const speed = 130 

    const loop = (time) => {
      animationFrameId = requestAnimationFrame(loop)

      // Continuous particle & crack updates outside the frame rate limiter so they anim smoothly
      // Clear canvas every animation frame for fluid rendering
      cols = Math.floor(width / cellSize)
      rows = Math.floor(height / cellSize)
      if (cols === 0 || rows === 0) return

      ctx.clearRect(0, 0, width, height)
      const timeMs = Date.now()

      // 1. Spawning active fire flames
      fires.forEach((f) => {
        f.age++
        // Spawn 2-3 rising flame particles per frame
        for (let i = 0; i < 2; i++) {
          particles.push({
            x: f.x + (Math.random() - 0.5) * 20,
            y: f.y + (Math.random() - 0.5) * 15,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -1.2 - Math.random() * 2,
            // HSL Orange, yellow, red spectrum colors
            color: `hsl(${12 + Math.random() * 32}, 100%, ${50 + Math.random() * 20}%)`,
            alpha: 1,
            size: 10 + Math.random() * 12,
            isFlame: true,
            decay: 0.012 + Math.random() * 0.015
          })
        }
      })
      fires = fires.filter((f) => f.age < f.maxAge)

      // 2. Drawing background crack lines
      cracks.forEach((c) => {
        c.age++
        const alpha = Math.max(0, 1 - c.age / c.maxAge)
        ctx.save()
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.35})`
        ctx.shadowColor = "rgba(255, 255, 255, 0.4)"
        ctx.shadowBlur = 5
        c.lines.forEach((l) => {
          ctx.lineWidth = l.width
          ctx.beginPath()
          ctx.moveTo(l.x1, l.y1)
          ctx.lineTo(l.x2, l.y2)
          ctx.stroke()
        })
        ctx.restore()
      })
      cracks = cracks.filter((c) => c.age < c.maxAge)

      // 3. Drawing explosion & flame particles
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.isFlame) {
          p.alpha -= p.decay
          p.size = Math.max(0, p.size - 0.2) // Fire shrinks as it rises
        } else {
          p.alpha -= 0.02
        }
        ctx.save()
        ctx.globalAlpha = Math.max(0, p.alpha)
        ctx.fillStyle = p.color
        ctx.shadowBlur = p.isFlame ? 12 : 8
        ctx.shadowColor = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })
      particles = particles.filter((p) => p.alpha > 0)

      // 4. Run simulation step according to game speed tick
      if (time - lastTime >= speed) {
        lastTime = time

        // Calculate next positions and check collisions
        snakes.forEach((s, sIdx) => {
          const head = s.body[0]
          let nextDir = { ...s.dir }
          const diffX = s.food.x - head.x
          const diffY = s.food.y - head.y

          const options = []
          if (diffX > 0 && s.dir.x !== -1) options.push({ x: 1, y: 0 })
          if (diffX < 0 && s.dir.x !== 1) options.push({ x: -1, y: 0 })
          if (diffY > 0 && s.dir.y !== -1) options.push({ x: 0, y: 1 })
          if (diffY < 0 && s.dir.y !== 1) options.push({ x: 0, y: -1 })

          const allDirs = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 },
          ]

          const safeOptions = [...options, ...allDirs].filter((d) => {
            if (d.x === -s.dir.x && d.y === -s.dir.y) return false
            const newX = (head.x + d.x + cols) % cols
            const newY = (head.y + d.y + rows) % rows
            return !s.body.some((segment) => segment.x === newX && segment.y === newY)
          })

          if (safeOptions.length > 0) {
            const targetOption = safeOptions.find(d => {
              return (diffX > 0 && d.x === 1) || (diffX < 0 && d.x === -1) || (diffY > 0 && d.y === 1) || (diffY < 0 && d.y === -1)
            })
            nextDir = targetOption || safeOptions[Math.floor(Math.random() * safeOptions.length)]
          }

          s.dir = nextDir

          const newHead = {
            x: (head.x + s.dir.x + cols) % cols,
            y: (head.y + s.dir.y + rows) % rows,
          }

          // Check if head hits another snake's body
          let collided = false
          snakes.forEach((other, otherIdx) => {
            if (sIdx !== otherIdx) {
              other.body.forEach((segment) => {
                if (newHead.x === segment.x && newHead.y === segment.y) {
                  collided = true
                  const crashX = newHead.x * cellSize + cellSize / 2
                  const crashY = newHead.y * cellSize + cellSize / 2
                  
                  spawnExplosion(crashX, crashY, s.color)
                  spawnExplosion(crashX, crashY, other.color)
                  cracks.push(generateCracks(crashX, crashY))
                  fires.push({ x: crashX, y: crashY, age: 0, maxAge: 200 }) // Ignite!

                  // Reset the crashed snake to a random position
                  s.body = createSnakeBody(
                    Math.floor(Math.random() * (cols - 4)) + 2,
                    Math.floor(Math.random() * (rows - 4)) + 2,
                    12,
                    s.dir
                  )
                }
              })
            }
          })

          if (!collided) {
            s.body.unshift(newHead)
            if (newHead.x === s.food.x && newHead.y === s.food.y) {
              s.food = getRandomFoodPos()
            } else {
              s.body.pop()
            }
          }
        })
      }

      // Draw all snakes & food
      snakes.forEach((s) => {
        // Draw Food
        ctx.fillStyle = "#ec4899"
        ctx.shadowBlur = 15
        ctx.shadowColor = "#ec4899"
        ctx.beginPath()
        ctx.arc(
          s.food.x * cellSize + cellSize / 2,
          s.food.y * cellSize + cellSize / 2,
          6,
          0,
          Math.PI * 2
        )
        ctx.fill()

        ctx.shadowBlur = 10
        ctx.shadowColor = s.color

        // Calculate points along snake wave
        const points = s.body.map((segment, idx) => {
          const centerX = segment.x * cellSize + cellSize / 2
          const centerY = segment.y * cellSize + cellSize / 2
          const perpX = -s.dir.y
          const perpY = s.dir.x
          const wave = Math.sin((timeMs * 0.008) - idx * 0.5) * 4.5

          const drawX = centerX + perpX * wave
          const drawY = centerY + perpY * wave

          const scale = Math.max(0.2, 1 - (idx / s.body.length) * 0.7)
          const radius = (cellSize / 2 - 2) * scale

          return { x: drawX, y: drawY, radius, perpX, perpY }
        })

        // Draw continuous green base body
        for (let i = points.length - 1; i > 0; i--) {
          const p1 = points[i]
          const p2 = points[i - 1]

          ctx.beginPath()
          ctx.strokeStyle = s.color
          ctx.lineWidth = p1.radius * 2
          ctx.lineCap = "round"
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.stroke()
        }

        // Draw circles for smooth overlapping
        for (let i = points.length - 1; i >= 0; i--) {
          const p = points[i]
          ctx.fillStyle = s.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fill()
        }

        // Draw continuous belly
        for (let i = points.length - 1; i > 0; i--) {
          const p1 = points[i]
          const p2 = points[i - 1]

          if (i > 1) {
            const b1x = p1.x + p1.perpX * (p1.radius * 0.35)
            const b1y = p1.y + p1.perpY * (p1.radius * 0.35)
            const b2x = p2.x + p2.perpX * (p2.radius * 0.35)
            const b2y = p2.y + p2.perpY * (p2.radius * 0.35)

            ctx.beginPath()
            ctx.strokeStyle = s.bellyColor
            ctx.lineWidth = p1.radius * 1.3
            ctx.lineCap = "round"
            ctx.moveTo(b1x, b1y)
            ctx.lineTo(b2x, b2y)
            ctx.stroke()
          }
        }

        // Draw spots
        for (let i = points.length - 2; i > 0; i--) {
          const p = points[i]
          
          ctx.save()
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.clip()

          ctx.fillStyle = s.spotColor
          ctx.beginPath()
          const spotX = p.x - p.perpX * (p.radius * 0.4)
          const spotY = p.y - p.perpY * (p.radius * 0.4)
          ctx.arc(spotX, spotY, p.radius * 0.45, 0, Math.PI * 2)
          ctx.fill()

          ctx.restore()
        }

        // Draw head
        const headPoint = points[0]
        const angle = Math.atan2(s.dir.y, s.dir.x)
        
        ctx.save()
        ctx.translate(headPoint.x, headPoint.y)
        ctx.rotate(angle)

        ctx.fillStyle = s.color
        ctx.beginPath()
        ctx.ellipse(0, 0, headPoint.radius * 1.5, headPoint.radius * 1.1, 0, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = s.spotColor
        ctx.beginPath()
        ctx.ellipse(-headPoint.radius * 0.7, -headPoint.radius * 0.4, 3, 2, Math.PI / 4, 0, Math.PI * 2)
        ctx.ellipse(-headPoint.radius * 0.5, headPoint.radius * 0.5, 4, 2.5, -Math.PI / 4, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "#ffffff"
        ctx.beginPath()
        ctx.ellipse(headPoint.radius * 0.3, -headPoint.radius * 0.3, headPoint.radius * 0.65, headPoint.radius * 0.75, Math.PI / 12, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = "rgba(0,0,0,0.15)"
        ctx.lineWidth = 1.5
        ctx.stroke()

        ctx.fillStyle = s.eyeColor
        ctx.beginPath()
        ctx.arc(headPoint.radius * 0.35, -headPoint.radius * 0.3, headPoint.radius * 0.4, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "#000000"
        ctx.beginPath()
        ctx.arc(headPoint.radius * 0.38, -headPoint.radius * 0.3, headPoint.radius * 0.22, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "#ffffff"
        ctx.beginPath()
        ctx.arc(headPoint.radius * 0.42, -headPoint.radius * 0.38, 2.5, 0, Math.PI * 2)
        ctx.arc(headPoint.radius * 0.32, -headPoint.radius * 0.22, 1.2, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = "rgba(0,0,0,0.2)"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(headPoint.radius * 0.7, headPoint.radius * 0.2, headPoint.radius * 0.4, Math.PI, Math.PI * 1.8, true)
        ctx.stroke()

        ctx.restore()

        // Tongue
        ctx.strokeStyle = "#1a1a1a"
        ctx.lineWidth = 1.5
        ctx.beginPath()
        const tongueStartX = headPoint.x + s.dir.x * headPoint.radius * 1.3
        const tongueStartY = headPoint.y + s.dir.y * headPoint.radius * 1.3
        const tongueEndX = tongueStartX + s.dir.x * 10
        const tongueEndY = tongueStartY + s.dir.y * 10

        ctx.moveTo(tongueStartX, tongueStartY)
        ctx.lineTo(tongueEndX, tongueEndY)
        
        if (s.dir.x !== 0) {
          ctx.lineTo(tongueEndX + s.dir.x * 3, tongueEndY - 3)
          ctx.moveTo(tongueEndX, tongueEndY)
          ctx.lineTo(tongueEndX + s.dir.x * 3, tongueEndY + 3)
        } else {
          ctx.lineTo(tongueEndX - 3, tongueEndY + s.dir.y * 3)
          ctx.moveTo(tongueEndX, tongueEndY)
          ctx.lineTo(tongueEndX + 3, tongueEndY + s.dir.y * 3)
        }
        ctx.stroke()

        // Tail
        const tail = points[points.length - 1]
        const pSeg = s.body[points.length - 2]
        const pWave = Math.sin((timeMs * 0.008) - (points.length - 2) * 0.5) * 4.5
        const pX = (pSeg.x * cellSize + cellSize / 2) + tail.perpX * pWave
        const pY = (pSeg.y * cellSize + cellSize / 2) + tail.perpY * pWave
        const tailAngle = Math.atan2(tail.y - pY, tail.x - pX)

        ctx.save()
        ctx.translate(tail.x, tail.y)
        ctx.rotate(tailAngle)

        ctx.fillStyle = s.color
        ctx.beginPath()
        ctx.moveTo(-tail.radius, -tail.radius * 0.7)
        ctx.quadraticCurveTo(tail.radius * 1.2, -tail.radius * 0.2, tail.radius * 1.8, 0)
        ctx.quadraticCurveTo(tail.radius * 1.2, tail.radius * 0.2, -tail.radius, tail.radius * 0.7)
        ctx.closePath()
        ctx.fill()

        ctx.restore()
      })
      ctx.shadowBlur = 0 
    }

    animationFrameId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await apiService.adminLogin(email, password)

      if (response.token) {
        apiService.setToken(response.token)
        onLogin()
      } else {
        setError("Login failed. Please check your credentials.")
      }
    } catch (err) {
      console.error("Login error:", err)
      if (email === "admin@yopmail.com" && password === "admin@420") {
        onLogin()
      } else {
        setError("Invalid credentials. Use admin@yopmail.com / admin@420 for demo.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        backgroundColor: "#080c14",
        backgroundImage: `
          linear-gradient(rgba(99, 102, 241, 0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99, 102, 241, 0.04) 1px, transparent 1px),
          radial-gradient(circle at 5% 10%, rgba(99, 102, 241, 0.18) 0%, transparent 35%), 
          radial-gradient(circle at 95% 90%, rgba(139, 92, 246, 0.18) 0%, transparent 35%),
          radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)
        `,
        backgroundSize: "40px 40px, 40px 40px, 100% 100%, 100% 100%, 100% 100%"
      }}
    >
      {/* Autonomous Snake Game Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Decorative Animated Orbs */}
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/3 w-[350px] h-[350px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

      <div
        className="max-w-md w-full p-[2px] rounded-3xl shadow-2xl relative z-10 animate-float overflow-hidden bg-slate-900/40"
      >
        <div className="absolute top-1/2 left-1/2 w-[250%] h-[250%] bg-[conic-gradient(from_0deg,#6366f1,#a855f7,#ec4899,#6366f1)] animate-spin-slow pointer-events-none origin-center"></div>
        <div className="relative w-full h-full bg-slate-950/95 rounded-[22px] p-8 md:p-10 backdrop-blur-2xl space-y-8">
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <div className="relative w-16 h-16 rounded-2xl bg-slate-950 flex items-center justify-center border border-slate-800">
                <svg width="32" height="32" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform group-hover:scale-110 transition duration-300">
                  <path d="M30 15L33.09 24.26L43 24.27L35.18 30.14L38.27 39.41L30 33.54L21.73 39.41L24.82 30.14L17 24.27L26.91 24.26L30 15Z" fill="url(#gradient-star)"/>
                  <defs>
                    <linearGradient id="gradient-star" x1="17" y1="15" x2="43" y2="39.41" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#6366f1" />
                      <stop offset="1" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
              Admin Login
            </h2>
            <p className="mt-2 text-center text-sm font-medium text-slate-400">
              Event UNA Management System
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm shadow backdrop-blur-md animate-shake">
                {error}
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative group/input">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 group-focus-within/input:text-indigo-400 transition-colors">
                    <FaEnvelope className="h-4 w-4" />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-slate-950/40 border border-slate-800 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all sm:text-sm hover:border-slate-700"
                    placeholder="name@company.com"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative group/input">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 group-focus-within/input:text-indigo-400 transition-colors">
                    <FaLock className="h-4 w-4" />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 bg-slate-950/40 border border-slate-800 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all sm:text-sm hover:border-slate-700"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                  >
                    {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold">
              <label className="flex items-center text-slate-400 cursor-pointer select-none">
                <input type="checkbox" className="rounded border-slate-800 bg-slate-950/40 text-indigo-500 focus:ring-indigo-500/20 mr-2 cursor-pointer" />
                Remember me
              </label>
              <span className="text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer">Forgot password?</span>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-200 cursor-pointer overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>

            <div className="text-center text-xs text-slate-400 bg-slate-950/60 border border-slate-800/80 rounded-xl py-3 px-4 shadow-inner">
              Demo credentials: <span className="text-indigo-400 font-mono font-medium">admin@yopmail.com</span> / <span className="text-indigo-400 font-mono font-medium">admin@420</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
