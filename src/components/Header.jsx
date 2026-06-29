"use client"

import { FaBars } from "react-icons/fa"

const Header = ({ activeSection, toggleSidebar, onLogout }) => {
  const getSectionDetails = (section) => {
    switch (section) {
      case "dashboard":
        return {
          title: "Dashboard Overview",
          subtitle: "Welcome back! Here's what is happening with Event Una today."
        }
      case "all-merchants":
        return {
          title: "Merchant Management",
          subtitle: "Review merchant applications, status updates, and credentials."
        }
      case "all-users":
        return {
          title: "User Directory",
          subtitle: "View and manage all registered users and system administrators."
        }
      case "add-notes":
        return {
          title: "Notes & Broadcasts",
          subtitle: "Write, edit, and publish important alerts or system notes."
        }
      case "additional-services":
        return {
          title: "Additional Services",
          subtitle: "Configure pricing, categories, and custom services."
        }
      case "place-preference":
        return {
          title: "Place Preferences",
          subtitle: "Manage location settings and preferred regional options."
        }
      case "add-event-type":
      case "add-event-category":
        return {
          title: "Event Configurations",
          subtitle: "Define available event categories, types, and tagging."
        }
      default:
        return {
          title: "Control Panel",
          subtitle: "Manage and configure the Event Una platform."
        }
    }
  }

  const details = getSectionDetails(activeSection)

  return (
    <header
      className="bg-gradient-to-r from-[#0d0f20] via-[#0a0c1a] to-[#07080e] px-8 h-20 sticky top-0 z-30 flex items-center shadow-md"
      style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer border border-slate-800"
          >
            <FaBars className="w-4 h-4" />
          </button>

          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-white tracking-tight leading-tight">
              {details.title}
            </h2>
            <p className="hidden sm:block text-xs text-slate-400 font-medium mt-0.5">
              {details.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-5">

          {/* User Info */}
          <div className="flex items-center space-x-3 group cursor-pointer p-1 rounded-xl hover:bg-slate-800/30 transition-all duration-300">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md shadow-indigo-500/10 text-white font-bold text-sm transform group-hover:scale-105 transition-transform duration-300">
              A
            </div>
            <div className="hidden md:block text-left pr-2">
              <p className="text-sm font-bold text-slate-200 tracking-tight leading-tight group-hover:text-indigo-400 transition-colors">Administrator</p>
              <p className="text-3xs text-slate-400 font-bold tracking-widest uppercase mt-0.5">Super User</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

