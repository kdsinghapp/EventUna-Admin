"use client"

import { useState } from "react"
import apiService from "../services/api"

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
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(34,34,34,0.6), rgba(34,34,34,0.7)), url('/Images/46485.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        className="max-w-md w-full space-y-8 rounded-2xl shadow-2xl p-10 backdrop-blur-md bg-white/30 border border-white/30"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
      >
        <div className="flex flex-col items-center">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="30" r="30" fill="#2563eb" fillOpacity="0.2"/>
            <path d="M30 15L33.09 24.26L43 24.27L35.18 30.14L38.27 39.41L30 33.54L21.73 39.41L24.82 30.14L17 24.27L26.91 24.26L30 15Z" fill="#2563eb"/>
          </svg>
          <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900 drop-shadow-lg">Admin Login</h2>
          <p className="mt-2 text-center text-base text-gray-700 font-medium drop-shadow">Event Management System</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm shadow">{error}</div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-base bg-white/80"
                placeholder="Email address"
                autoComplete="username"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-base bg-white/80"
                placeholder="Password"
                autoComplete="current-password"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 shadow-lg transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : "Sign in"}
            </button>
          </div>
          <div className="text-center text-sm text-gray-700 font-medium bg-white/60 rounded-md py-2 mt-4 shadow">
            Demo credentials: <span className="font-mono">admin@yopmail.com</span> / <span className="font-mono">admin@420</span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
