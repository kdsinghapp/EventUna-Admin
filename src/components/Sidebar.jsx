"use client"

// import { useState } from "react"
import { FaStore, FaClipboardList, FaCog, FaUsers, FaStickyNote, FaPlus, FaSignInAlt, FaLayerGroup, FaMapMarkerAlt, FaThList, FaChartBar } from "react-icons/fa"

const Sidebar = ({ activeSection, setActiveSection, isOpen, setIsOpen, onLogout }) => {




  const menuItems = [
    {
      id: "merchant",
      label: "Merchant",
      icon: <FaStore />,
      children: [
        { id: "all-merchants", label: "all-merchants",  color: "text-green-600", icon: <FaThList /> },
      ],
    },

        { id: "add-event-type", label: "Add Event Type & Category", color: "text-green-600", icon: <FaPlus /> },
      
    { id: "services", label: "services",  color: "text-orange-600", icon: <FaCog /> },
    { id: "get-all-services", label: "Get All Services",  color: "text-green-600", icon: <FaClipboardList /> },
    { id: "get-sub-services", label: "Get Sub Services",  color: "text-green-600", icon: <FaLayerGroup /> },
    { id: "add-notes", label: "Add Notes",  color: "text-orange-600", icon: <FaStickyNote /> },
    { id: "all-users", label: "All Users",  color: "text-green-600", icon: <FaUsers /> },
    { id: "additional-services", label: "Additional Services",  color: "text-orange-600", icon: <FaPlus /> },
    { id: "place-preference", label: "Place Preference", color: "text-orange-600", icon: <FaMapMarkerAlt /> },
    { id: "subservices", label: "Subservices",  color: "text-orange-600", icon: <FaLayerGroup /> },
  ]

  const renderMenuItem = (item, level = 0) => {
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;
    const isActive = activeSection === item.id;

    return (
      <div key={item.id} className={`${level > 0 ? "ml-4" : ""}`}>
        <div
          className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200 ${
            isActive ? "bg-blue-100 text-blue-700 border-l-4 border-blue-500" : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setActiveSection(item.id)}
        >
          <div className="flex items-center space-x-2">
            {item.icon && <span className="text-lg">{item.icon}</span>}
            <span className="text-sm font-medium">{item.label}</span>
            {item.method && (
              <span className={`text-xs px-2 py-1 rounded font-semibold ${item.color}`}>{item.method}</span>
            )}
          </div>
        </div>

        {hasChildren && (
          <div className="mt-1 space-y-1">{item.children.map((child) => renderMenuItem(child, level + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-30 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">Event UNA</h1>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              ✕
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            <div
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                activeSection === "dashboard"
                  ? "bg-blue-100 text-blue-700 border-l-4 border-blue-500"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveSection("dashboard")}
            >
              <span className="text-lg"><FaChartBar /></span>
              <span className="text-sm font-medium">Dashboard</span>
            </div>

            {menuItems.map((item) => renderMenuItem(item))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200 text-gray-700 hover:bg-gray-100"
              onClick={onLogout}
            >
              <span className="text-lg"><FaSignInAlt /></span>
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
