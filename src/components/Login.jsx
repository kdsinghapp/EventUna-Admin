"use client"

import { useState } from "react"
import apiService from "../services/api"
import { FaLock, FaEnvelope } from "react-icons/fa"

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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
        backgroundColor: "#0b0f19",
        backgroundImage: `radial-gradient(circle at 10% 20%, rgba(79, 70, 229, 0.15) 0%, transparent 40%), 
                          radial-gradient(circle at 90% 80%, rgba(124, 58, 237, 0.15) 0%, transparent 40%)`
      }}
    >
      {/* Background Decorative Blob */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div
        className="max-w-md w-full space-y-8 rounded-2xl shadow-2xl p-8 md:p-10 backdrop-blur-xl bg-slate-900/60 border border-slate-800/80 hover-lift relative z-10"
      >
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg width="32" height="32" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 15L33.09 24.26L43 24.27L35.18 30.14L38.27 39.41L30 33.54L21.73 39.41L24.82 30.14L17 24.27L26.91 24.26L30 15Z" fill="white"/>
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-white tracking-tight">Admin Login</h2>
          <p className="mt-2 text-center text-sm text-slate-400">Event UNA Management System</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm shadow backdrop-blur-md">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <FaEnvelope className="h-4 w-4" />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-800 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all sm:text-sm"
                  placeholder="name@company.com"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <FaLock className="h-4 w-4" />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-800 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all sm:text-sm"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 shadow-lg shadow-indigo-600/20 transition-all duration-200 cursor-pointer"
            >
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

          <div className="text-center text-xs text-slate-400 bg-slate-950/40 border border-slate-800/60 rounded-xl py-3 px-4 shadow">
            Demo credentials: <span className="text-indigo-400 font-mono">admin@yopmail.com</span> / <span className="text-indigo-400 font-mono">admin@420</span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
