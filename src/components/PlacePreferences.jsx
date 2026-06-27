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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Info and Add Preference Inline Form */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-950 tracking-tight">Place Preferences</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage preferences for participating facilities and venue spaces.</p>
        </div>

        {/* Input field and Add Preference button inline */}
        <form onSubmit={handleAddPreference} className="flex-1 max-w-md flex items-center gap-3">
          <input
            type="text"
            value={preference}
            onChange={(e) => setPreference(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm placeholder-slate-400"
            placeholder="Enter place preference..."
            required
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow shrink-0"
            disabled={!preference.trim()}
          >
            Add Preference
          </button>
        </form>
      </div>

      {/* Downside Preferences Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider w-6/12">
                  Preference Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider w-2/12">
                  Created Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider w-2/12">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {preferences.map((pref) => (
                <tr key={pref.id} className="hover:bg-slate-50/70 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs font-semibold text-slate-900">{pref.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">{pref.createdAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-3">
                    <button className="text-green-600 hover:text-green-800 transition-colors font-semibold">Edit</button>
                    <button className="text-rose-600 hover:text-rose-800 transition-colors font-semibold">Delete</button>
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
