"use client"

import { useState } from "react"

const PlacePreferences = () => {
  const [preference, setPreference] = useState("")
  const [preferences, setPreferences] = useState([
    { id: "1", name: "Other participating facilities", createdAt: "2024-01-15", isDefault: true },
    { id: "2", name: "Indoor venues only", createdAt: "2024-01-14", isDefault: false },
    { id: "3", name: "Outdoor spaces preferred", createdAt: "2024-01-13", isDefault: false },
  ])

  const handleAddPreference = (e) => {
    e.preventDefault()
    if (preference.trim()) {
      const newPreference = {
        id: Date.now().toString(),
        name: preference,
        createdAt: new Date().toISOString().split("T")[0],
        isDefault: false,
      }
      setPreferences((prev) => [newPreference, ...prev])
      setPreference("")
    }
  }

  const setAsDefault = (id) => {
    setPreferences((prev) =>
      prev.map((pref) => ({
        ...pref,
        isDefault: pref.id === id,
      })),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Place Preferences</h1>
      </div>

      {/* Add Preference Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Place Preference</h2>
        <form onSubmit={handleAddPreference} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preference Name</label>
            <input
              type="text"
              value={preference}
              onChange={(e) => setPreference(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter place preference..."
              required
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Add Preference
          </button>
        </form>
      </div>

      {/* Preferences List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Place Preferences</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preference Name
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
              {preferences.map((pref) => (
                <tr key={pref.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{pref.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pref.createdAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {pref.isDefault ? (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        Default
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {!pref.isDefault && (
                      <button onClick={() => setAsDefault(pref.id)} className="text-blue-600 hover:text-blue-900">
                        Set Default
                      </button>
                    )}
                    <button className="text-green-600 hover:text-green-900">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default PlacePreferences
