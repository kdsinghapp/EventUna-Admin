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
        } catch (e) {}
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
      } catch (e) {}
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Additional Services</h1>
      </div>

      {/* Add Service Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Additional Service</h2>
        <form onSubmit={handleAddService} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter additional service name..."
              required
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Add Service
          </button>
        </form>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Additional Services</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S. No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service, idx) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{idx + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editId === service.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={handleEditChange}
                        className="px-2 py-1 border border-gray-300 rounded"
                        autoFocus
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900">{service.name}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.createdAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}
                    >
                      {service.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium relative">
                    <div className="relative inline-block text-left">
                      <button
                        type="button"
                        className="inline-flex justify-center w-8 h-8 rounded-full hover:bg-gray-200 focus:outline-none"
                        onClick={() => setOpenMenuId(openMenuId === service.id ? null : service.id)}
                        aria-haspopup="true"
                        aria-expanded={openMenuId === service.id}
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <circle cx="10" cy="4" r="1.5" />
                          <circle cx="10" cy="10" r="1.5" />
                          <circle cx="10" cy="16" r="1.5" />
                        </svg>
                      </button>
                      {openMenuId === service.id && (
                        <div className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                setEditId(service.id);
                                setEditName(service.name);
                                setShowEditModal(true);
                                setOpenMenuId(null);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setShowDeleteId(service.id);
                                setOpenMenuId(null);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setOpenMenuId(null)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Edit Service Name</h3>
            <input
              type="text"
              value={editName}
              onChange={handleEditChange}
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleEditSave(editId)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={handleEditCancel}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Delete Service</h3>
            <p className="mb-4">Are you sure you want to delete this service?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleDelete(showDeleteId)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteId(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdditionalServices
