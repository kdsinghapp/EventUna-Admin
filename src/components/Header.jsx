"use client"

import { FaBars, FaBell, FaUserCircle } from "react-icons/fa"

const Header = ({ toggleSidebar, onLogout }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-150 px-6 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <FaBars className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Event Una</h2>
        </div>

        <div className="flex items-center space-x-5">
          {/* Notification Icon */}
          <button className="relative p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer">
            <FaBell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full"></span>
          </button>

          {/* Vertical Divider */}
          <span className="w-px h-6 bg-slate-200"></span>

          {/* User Info & Quick Actions */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm text-white font-semibold text-sm">
                A
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-slate-800">Administrator</p>
                <p className="text-xs text-slate-450">Super User</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
