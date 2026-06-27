"use client"

import { useState } from "react"

const ServicesManagement = ({ activeTab = "add" }) => {
  const [tab, setTab] = useState(activeTab)
  const [serviceName, setServiceName] = useState("")
  const [services, setServices] = useState([
    { id: "1", name: "Catering", createdAt: "2024-01-15", status: "active" },
    { id: "2", name: "Photography", createdAt: "2024-01-10", status: "active" },
    { id: "3", name: "Entertainment & Clown", createdAt: "2024-01-12", status: "active" },
  ])

  const handleAddService = (e) => {
    e.preventDefault()
    if (serviceName.trim()) {
      const newService = {
        id: Date.now().toString(),
        name: serviceName,
        createdAt: new Date().toISOString().split("T")[0],
        status: "active",
      }
      setServices((prev) => [newService, ...prev])
      setServiceName("")
      setTab("view") // redirect to view tab to see it added
    }
  }

  const handleDeleteService = (id) => {
    setServices((prev) => prev.filter(service => service.id !== id))
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6 py-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Services Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Configure and manage primary service categories offered in the ecosystem.</p>
        </div>
      </div>

      {/* Tabs bar */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-6">
          {[
            { id: "add", label: "Add Service", icon: "M12 6v6m0 0v6m0-6h6m-6 0H6" },
            { id: "view", label: `View All Services (${services.length})`, icon: "M4 6h16M4 12h16M4 18h7" }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`py-3.5 px-1 border-b-2 font-bold text-xs uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all duration-200 ${tab === t.id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300"
                }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={t.icon} />
              </svg>
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Add Service Tab */}
      {tab === "add" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm max-w-xl animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">Add New Service</h2>
          </div>

          <form onSubmit={handleAddService} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Service Category Name</label>
              <input
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm placeholder-slate-400"
                placeholder="e.g. Photography, Catering, Florist"
                required
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow active:scale-98"
            >
              Add Service
            </button>
          </form>
        </div>
      )}

      {/* View Services Tab */}
      {tab === "view" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/20">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">Service Categories</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Service Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-slate-50/60 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-900">{service.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                      {service.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                        <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-emerald-500"></span>
                        {service.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                      <button className="text-indigo-600 hover:text-indigo-800 transition-colors">Edit</button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="text-rose-600 hover:text-rose-800 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {services.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">
                      No service configurations available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default ServicesManagement

