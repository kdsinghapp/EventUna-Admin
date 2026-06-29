"use client"

import { useState } from "react"
import apiService from "../services/api"
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa"

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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
