"use client"

import { useState, useEffect } from "react"
import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import Dashboard from "./components/Dashboard"
import MerchantManagement from "./components/MerchantManagement"
import UserManagement from "./components/UserManagement"
import NotesManagement from "./components/NotesManagement"
import AdditionalServices from "./components/AdditionalServices"
import PlacePreferences from "./components/PlacePreferences"
import Login from "./components/Login"
import EventTypes from "./components/EventTypes"

function App() {
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem("activeSection") || "dashboard"
  })
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check localStorage for auth state on first render
    return localStorage.getItem("isAuthenticated") === "true"
  })
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    localStorage.setItem("activeSection", activeSection)
  }, [activeSection])

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard setActiveSection={setActiveSection} />
      case "all-merchants":
        return <MerchantManagement />
      case "all-users":
        return <UserManagement />
      case "add-notes":
        return <NotesManagement />
      case "additional-services":
        return <AdditionalServices />
      case "place-preference":
        return <PlacePreferences />
      case "add-event-type":
        return <EventTypes />
      case "add-event-category":
        return <EventTypes />
      default:
        return <Dashboard />
    }
  }


  // When login, set localStorage
  const handleLogin = () => {
    setIsAuthenticated(true)
    localStorage.setItem("isAuthenticated", "true")
  }

  // When logout, clear localStorage
  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("activeSection")
    setActiveSection("dashboard")
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeSection={activeSection} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} onLogout={handleLogout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">{renderContent()}</main>
      </div>
    </div>
  )
}

export default App
