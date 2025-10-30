"use client"

import { useState } from "react"

const SubServices = ({ activeTab = "view" }) => {
  const [tab, setTab] = useState(activeTab)
  const [subService, setSubService] = useState("")
  const [selectedServiceId, setSelectedServiceId] = useState("")

  const [services] = useState([
    { id: "686fb6ced46e9740ee8277ec", name: "Catering" },
    { id: "2", name: "Photography" },
    { id: "3", name: "Entertainment" },
  ])

  const [subServices, setSubServices] = useState([
    {
      id: "1",
      name: "South Indian",
      serviceId: "686fb6ced46e9740ee8277ec",
      serviceName: "Catering",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "North Indian",
      serviceId: "686fb6ced46e9740ee8277ec",
      serviceName: "Catering",
      createdAt: "2024-01-14",
    },
    { id: "3", name: "Wedding Photography", serviceId: "2", serviceName: "Photography", createdAt: "2024-01-13" },
  ])

  const handleAddSubService = (e) => {
    e.preventDefault()
    if (subService.trim() && selectedServiceId) {
      const selectedService = services.find((s) => s.id === selectedServiceId)
      const newSubService = {
        id: Date.now().toString(),
        name: subService,
        serviceId: selectedServiceId,
        serviceName: selectedService.name,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setSubServices((prev) => [newSubService, ...prev])
      setSubService("")
      setSelectedServiceId("")
    }
  }

  const getSubServicesByService = (serviceId) => {
    return subServices.filter((sub) => sub.serviceId === serviceId)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Sub Services Management</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setTab("add")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              tab === "add"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Add Sub Service
          </button>
          <button
            onClick={() => setTab("view")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              tab === "view"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            View Sub Services
          </button>
        </nav>
      </div>

      {/* Add Sub Service Tab */}
      {tab === "add" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Sub Service</h2>
          <form onSubmit={handleAddSubService} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Parent Service</label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a service...</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sub Service Name</label>
              <input
                type="text"
                value={subService}
                onChange={(e) => setSubService(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter sub service name..."
                required
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Add Sub Service
            </button>
          </form>
        </div>
      )}

      {/* View Sub Services Tab */}
      {tab === "view" && (
        <div className="space-y-6">
          {services.map((service) => {
            const serviceSubServices = getSubServicesByService(service.id)
            return (
              <div key={service.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {service.name} ({serviceSubServices.length} sub services)
                  </h3>
                </div>

                {serviceSubServices.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Sub Service Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {serviceSubServices.map((subSrv) => (
                          <tr key={subSrv.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{subSrv.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subSrv.createdAt}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">Edit</button>
                              <button className="text-red-600 hover:text-red-900">Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="px-6 py-8 text-center text-gray-500">No sub services found for this service.</div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SubServices
