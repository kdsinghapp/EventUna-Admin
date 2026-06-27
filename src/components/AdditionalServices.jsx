"use client"


import { useState, useEffect } from "react"
import apiService from "../services/api"

const AdditionalServices = () => {
  const [serviceName, setServiceName] = useState("")
  const [services, setServices] = useState([])
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState("")
  const [showDeleteId, setShowDeleteId] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [openMenuId, setOpenMenuId] = useState(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await apiService.getAllAdditionalServices()
        // response.data is expected as per API
        const formatted = (response.data || []).map((s) => ({
          id: s.id,
          name: s.servicesName,
          createdAt: s.createdAt ? s.createdAt.split("T")[0] : "",
          status: "active", // No status in API, default to active
        }))
        setServices(formatted)
      } catch (error) {
        setServices([])
      }
    }
    fetchServices()
  }, [])

  const handleAddService = async (e) => {
    e.preventDefault()
    if (serviceName.trim()) {
      try {
        const response = await apiService.addAdditionalService({ servicesName: serviceName })
        // Assuming API returns the created service object
        const newService = {
          id: response?.id || Date.now().toString(),
          name: response?.servicesName || serviceName,
          createdAt: response?.createdAt ? response.createdAt.split("T")[0] : new Date().toISOString().split("T")[0],
          status: "active",
        }
        setServices((prev) => [newService, ...prev])
        setServiceName("")
      } catch (error) {
        // Try to fetch the latest list to check if it was actually added
        try {
          const refreshed = await apiService.getAllAdditionalServices()
          const exists = (refreshed.data || []).some(s => s.servicesName === serviceName)
          if (exists) {
            setServiceName("")
            // Optionally, refresh the list
            const formatted = (refreshed.data || []).map((s) => ({
              id: s.id,
              name: s.servicesName,
              createdAt: s.createdAt ? s.createdAt.split("T")[0] : "",
              status: "active",
            }))
            setServices(formatted)
            return
          }
        } catch (e) { }
        console.error("Add service error:", error)
        alert("Failed to add service. Please try again.")
      }
    }
  }

  // Commented out as not currently used
  // const toggleStatus = async (id) => {
  //   const service = services.find((s) => s.id === id)
  //   if (!service) return
  //   const newStatus = service.status === "active" ? "inactive" : "active"
  //   try {
  //     await apiService.updateAdditionalService(id, { status: newStatus })
  //     setServices((prev) =>
  //       prev.map((s) =>
  //         s.id === id ? { ...s, status: newStatus } : s
  //       )
  //     )
  //   } catch (error) {
  //     alert("Failed to update status.")
  //   }
  // }

  const handleDelete = async (id) => {
    try {
      await apiService.deleteAdditionalService(id)
      setServices((prev) => prev.filter((s) => s.id !== id))
      setShowDeleteId(null)
    } catch (error) {
      // Try to fetch the latest list to check if it was actually deleted
      try {
        const refreshed = await apiService.getAllAdditionalServices()
        const exists = (refreshed.data || []).some(s => s.id === id)
        if (!exists) {
          setServices((prev) => prev.filter((s) => s.id !== id))
          setShowDeleteId(null)
          return
        }
      } catch (e) { }
      console.error("Delete service error:", error)
      alert("Failed to delete service.")
    }
  }


  // Commented out as not currently used
  // const handleEdit = (service) => {
  //   setEditId(service.id)
  //   setEditName(service.name)
  //   setShowEditModal(true)
  // }

  const handleEditChange = (e) => {
    setEditName(e.target.value)
  }

  const handleEditSave = async (id) => {
    if (!editName.trim()) return
    try {
      await apiService.updateAdditionalService(id, { servicesName: editName })
      setServices((prev) => prev.map((s) => s.id === id ? { ...s, name: editName } : s))
      setEditId(null)
      setEditName("")
      setShowEditModal(false)
    } catch (error) {
      alert("Failed to update service name.")
    }
  }

  const handleEditCancel = () => {
    setEditId(null)
    setEditName("")
    setShowEditModal(false)
  }

  const getStatusColor = (status) => {
    return status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Info and Add Service Inline Form */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-950 tracking-tight">Additional Services</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage supplementary service offerings available on the platform.</p>
        </div>

        {/* Input field and Add Service button inline */}
        <form onSubmit={handleAddService} className="flex-1 max-w-md flex items-center gap-3">
          <input
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm placeholder-slate-400"
            placeholder="Enter additional service name..."
            required
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow shrink-0"
            disabled={!serviceName.trim()}
          >
            Add Service
          </button>
        </form>
      </div>

      {/* Downside Services Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider w-1/12">
                  S. No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider w-6/12">
                  Service Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider w-2/12">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider w-1/12">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {services.map((service, idx) => (
                <tr key={service.id} className="hover:bg-slate-50/70 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-semibold">{idx + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editId === service.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={handleEditChange}
                        className="px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
                        autoFocus
                      />
                    ) : (
                      <div className="text-xs font-semibold text-slate-900">{service.name}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200/60`}
                    >
                      <span className="w-1 h-1 rounded-full bg-green-500"></span>
                      {service.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-3">
                    {editId === service.id ? (
                      <>
                        <button
                          onClick={() => handleEditSave(service.id)}
                          className="text-green-600 hover:text-green-800 transition-colors font-semibold"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="text-slate-500 hover:text-slate-700 transition-colors font-semibold"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditId(service.id);
                            setEditName(service.name);
                          }}
                          className="text-indigo-600 hover:text-indigo-800 transition-colors font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setShowDeleteId(service.id)}
                          className="text-rose-600 hover:text-rose-800 transition-colors font-semibold"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400 font-medium text-xs">
                    No additional services found. Add one using the input above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 animate-scale-up">
            <h3 className="text-xl font-bold text-slate-950 mb-2">Delete Service</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to delete this additional service? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteId(null)}
                className="px-4 py-2.5 text-sm font-semibold text-slate-650 hover:bg-slate-50 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteId)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-all shadow-sm hover:shadow"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdditionalServices
