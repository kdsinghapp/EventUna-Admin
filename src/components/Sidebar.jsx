"use client"

import { FaStore, FaUsers, FaStickyNote, FaPlus, FaSignInAlt, FaMapMarkerAlt, FaThList, FaChartBar } from "react-icons/fa"

const Sidebar = ({ activeSection, setActiveSection, isOpen, setIsOpen, onLogout }) => {

  const menuItems = [
    {
      id: "merchant",
      label: "Merchant Management",
      icon: <FaStore />,
      colorClass: "text-emerald-400",
      children: [
        { id: "all-merchants", label: "All Merchants", colorClass: "text-emerald-400", icon: <FaThList /> },
      ],
    },
    { id: "add-event-type", label: "Add Event Type & Category", colorClass: "text-pink-400", icon: <FaPlus /> },
    { id: "add-notes", label: "Add Notes", colorClass: "text-amber-400", icon: <FaStickyNote /> },
    { id: "all-users", label: "All Users", colorClass: "text-cyan-400", icon: <FaUsers /> },
    { id: "additional-services", label: "Additional Services", colorClass: "text-violet-400", icon: <FaPlus /> },
    { id: "place-preference", label: "Place Preference", colorClass: "text-rose-400", icon: <FaMapMarkerAlt /> }
  ]

  const renderMenuItem = (item, level = 0) => {
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;
    const isActive = activeSection === item.id;
    const isChildActive = hasChildren && item.children.some(child => activeSection === child.id);

    return (
      <div key={item.id} className={`${level > 0 ? "ml-4" : ""}`}>
        <div
          className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 group relative ${
            isActive || isChildActive
              ? "bg-gradient-to-r from-indigo-600/25 via-violet-600/10 to-transparent text-white font-bold shadow-md shadow-indigo-950/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/20"
            }`}
          onClick={() => {
            setActiveSection(item.id);
            if (!hasChildren) {
              setIsOpen(false);
            }
          }}
        >
          {/* Glowing vertical pill active indicator */}
          {(isActive || isChildActive) && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-indigo-400 via-purple-500 to-pink-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
          )}

          <div className="flex items-center space-x-3.5">
            {item.icon && (
              <span className={`text-lg transition-all duration-300 ${
                isActive || isChildActive 
                  ? `${item.colorClass} scale-110 drop-shadow-[0_0_6px_rgba(99,102,241,0.3)]` 
                  : "text-slate-500 group-hover:text-slate-300 group-hover:scale-105"
              }`}>
                {item.icon}
              </span>
            )}
            <span className="text-sm tracking-wide">{item.label}</span>
          </div>
        </div>

        {hasChildren && (
          <div className="mt-1.5 space-y-1.5 pl-3.5 border-l border-slate-800/80 ml-5.5">
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
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40 lg:hidden transition-opacity duration-300" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-[#090b16] via-[#0d0f20] to-[#07080e] text-slate-100 shadow-2xl transform transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
        style={{ borderRight: '1px solid rgba(255, 255, 255, 0.05)' }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div 
            className="flex items-center justify-between px-6 h-20 flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 transform hover:rotate-6 transition-transform duration-300">
                <svg width="20" height="20" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M30 15L33.09 24.26L43 24.27L35.18 30.14L38.27 39.41L30 33.54L21.73 39.41L24.82 30.14L17 24.27L26.91 24.26L30 15Z" fill="white" />
                </svg>
              </div>
              <div>
                <h1 className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 tracking-wider uppercase">Event UNA</h1>
                <p className="text-3xs text-indigo-400 font-extrabold tracking-widest uppercase mt-0.5">Admin Panel</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            <div
              className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 group relative ${
                activeSection === "dashboard"
                  ? "bg-gradient-to-r from-indigo-600/25 via-violet-600/10 to-transparent text-white font-bold shadow-md shadow-indigo-950/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/20"
                }`}
              onClick={() => {
                setActiveSection("dashboard");
                setIsOpen(false);
              }}
            >
              {/* Glowing vertical pill active indicator */}
              {activeSection === "dashboard" && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-indigo-400 via-purple-500 to-pink-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
              )}

              <div className="flex items-center space-x-3.5">
                <span className={`text-lg transition-all duration-300 ${
                  activeSection === "dashboard" 
                    ? "text-indigo-400 scale-110 drop-shadow-[0_0_6px_rgba(99,102,241,0.3)]" 
                    : "text-slate-500 group-hover:text-slate-300 group-hover:scale-105"
                }`}><FaChartBar /></span>
                <span className="text-sm tracking-wide">Dashboard</span>
              </div>
            </div>

            {menuItems.map((item) => renderMenuItem(item))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-slate-900/50 bg-slate-950/30" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <button
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 font-bold border border-transparent hover:border-rose-500/20"
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


