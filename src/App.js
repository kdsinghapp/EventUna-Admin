// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import SubServices from "./pages/SubServices";
// import Preferences from "./pages/Preferences";
// import Services from "./pages/Services";
// import SubServicesList from "./pages/SubServicesList";
// import AdditionalServices from "./pages/AdditionalServices";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/dashboard" element={<Services />} />
//         <Route path="/subservices" element={<SubServices />} />
//         <Route path="/preferences" element={<Preferences />} />
//         <Route path="/merchant-subservices" element={<SubServicesList />} />
//         <Route path="/additional-services" element={<AdditionalServices />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }
"use client"

import { useState } from "react"
import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import Dashboard from "./components/Dashboard"
import MerchantManagement from "./components/MerchantManagement"
import ServicesManagement from "./components/ServicesManagement"
import UserManagement from "./components/UserManagement"
import NotesManagement from "./components/NotesManagement"
import AdditionalServices from "./components/AdditionalServices"
import PlacePreferences from "./components/PlacePreferences"
import SubServices from "./components/SubServices"
import Login from "./components/Login"


import { useEffect } from "react"

function App() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check localStorage for auth state on first render
    return localStorage.getItem("isAuthenticated") === "true"
  })
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />
      case "all-merchants":
        return <MerchantManagement />
      case "services":
        return <ServicesManagement />
      case "get-all-services":
        return <ServicesManagement activeTab="view" />
      case "get-sub-services":
        return <SubServices />
      case "all-users":
        return <UserManagement />
      case "add-notes":
        return <NotesManagement />
      case "additional-services":
        return <AdditionalServices />
      case "place-preference":
        return <PlacePreferences />
      case "subservices":
        return <SubServices activeTab="add" />
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
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} onLogout={handleLogout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">{renderContent()}</main>
      </div>
    </div>
  )
}

export default App
