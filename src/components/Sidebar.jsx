"use client"

import { FaStore, FaClipboardList, FaCog, FaUsers, FaStickyNote, FaPlus, FaSignInAlt, FaLayerGroup, FaMapMarkerAlt, FaThList, FaChartBar } from "react-icons/fa"

const Sidebar = ({ activeSection, setActiveSection, isOpen, setIsOpen, onLogout }) => {

  const menuItems = [
    {
      id: "merchant",
      label: "Merchant Management",
      icon: <FaStore />,
      children: [
        { id: "all-merchants", label: "All Merchants", color: "text-emerald-400", icon: <FaThList /> },
      ],
    },
    { id: "add-event-type", label: "Add Event Type & Category", color: "text-emerald-400", icon: <FaPlus /> },
    { id: "get-all-services", label: "Get All Services", color: "text-emerald-400", icon: <FaClipboardList /> },
    { id: "get-sub-services", label: "Get Sub Services", color: "text-emerald-400", icon: <FaLayerGroup /> },
    { id: "add-notes", label: "Add Notes", color: "text-amber-400", icon: <FaStickyNote /> },
    { id: "all-users", label: "All Users", color: "text-emerald-400", icon: <FaUsers /> },
    { id: "additional-services", label: "Additional Services", color: "text-amber-400", icon: <FaPlus /> },
    { id: "place-preference", label: "Place Preference", color: "text-amber-400", icon: <FaMapMarkerAlt /> },
    { id: "subservices", label: "Subservices", color: "text-amber-400", icon: <FaLayerGroup /> },
  ]

  const renderMenuItem = (item, level = 0) => {
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;
    const isActive = activeSection === item.id;

    return (
      <div key={item.id} className={`${level > 0 ? "ml-4" : ""}`}>
        <div
          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${isActive
              ? "bg-indigo-600/15 text-indigo-400 border-l-4 border-indigo-500 font-medium"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
          onClick={() => setActiveSection(item.id)}
        >
          <div className="flex items-center space-x-3">
            {item.icon && <span className={`text-lg ${isActive ? "text-indigo-400" : "text-slate-500"}`}>{item.icon}</span>}
            <span className="text-sm font-medium tracking-wide">{item.label}</span>
          </div>
        </div>

        {hasChildren && (
          <div className="mt-1 space-y-1 pl-2 border-l border-slate-800 ml-5">
            {item.children.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-900 text-slate-100 shadow-xl transform transition-transform duration-300 ease-in-out border-r border-slate-800
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
                <svg width="18" height="18" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M30 15L33.09 24.26L43 24.27L35.18 30.14L38.27 39.41L30 33.54L21.73 39.41L24.82 30.14L17 24.27L26.91 24.26L30 15Z" fill="white" />
                </svg>
              </div>
              <h1 className="text-lg font-bold text-white tracking-wider uppercase">Event UNA</h1>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar">
            <div
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${activeSection === "dashboard"
                  ? "bg-indigo-600/15 text-indigo-400 border-l-4 border-indigo-500 font-medium"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                }`}
              onClick={() => setActiveSection("dashboard")}
            >
              <span className={`text-lg ${activeSection === "dashboard" ? "text-indigo-400" : "text-slate-500"}`}><FaChartBar /></span>
              <span className="text-sm font-medium tracking-wide">Dashboard</span>
            </div>

            {menuItems.map((item) => renderMenuItem(item))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/50">
            <button
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-200 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 font-medium"
              onClick={onLogout}
            >
              <span className="text-lg"><FaSignInAlt /></span>
              <span className="text-sm tracking-wide">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
