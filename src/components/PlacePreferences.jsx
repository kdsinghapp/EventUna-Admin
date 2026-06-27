"use client"

import { useState, useEffect } from "react"
import apiService from "../services/api"

const PlacePreferences = () => {
  const [preference, setPreference] = useState("")
  const [preferences, setPreferences] = useState([])
  const [loading, setLoading] = useState(false)
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState("")
  const [error, setError] = useState(null)

  const fetchPreferences = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getPlacePreferences()
      if (response && Array.isArray(response.preferences)) {
        setPreferences(response.preferences)
      } else {
        setPreferences([])
      }
    } catch (err) {
      console.error("Error fetching place preferences:", err)
      setError("Failed to fetch preferences.")
      setPreferences([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPreferences()
  }, [])

  const handleAddPreference = async (e) => {
    e.preventDefault()
    if (!preference.trim()) return
    try {
      setError(null)
      await apiService.addPlacePreference(preference)
      setPreference("")
      fetchPreferences()
    } catch (err) {
      console.error("Error adding place preference:", err)
      setError("Failed to add preference.")
    }
  }

  const handleEditSave = async (id) => {
    if (!editName.trim()) return
    try {
      setError(null)
      await apiService.updatePlacePreference(id, editName)
      setEditId(null)
      setEditName("")
      fetchPreferences()
    } catch (err) {
      console.error("Error updating preference:", err)
      setError("Failed to update preference.")
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this preference?")) return
    try {
      setError(null)
      await apiService.deletePlacePreference(id)
      fetchPreferences()
    } catch (err) {
      console.error("Error deleting preference:", err)
      setError("Failed to delete preference.")
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Info and Add Preference Inline Form */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-955 tracking-tight">Place Preferences</h1>
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

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3.5 rounded-xl flex items-center gap-3 text-sm animate-fade-in shadow-xs">
          <svg className="w-5 h-5 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}

      {/* Downside Preferences Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider w-6/12">
                  Preference Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider w-3/12">
                  Created Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider w-3/12">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {loading && preferences.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-8 h-8 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin"></div>
                      <p className="text-xs font-medium text-slate-400">Loading preferences...</p>
                    </div>
                  </td>
                </tr>
              ) : preferences.length > 0 ? (
                preferences.map((pref) => {
                  const prefId = pref._id || pref.id
                  return (
                    <tr key={prefId} className="hover:bg-slate-50/70 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editId === prefId ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
                            autoFocus
                          />
                        ) : (
                          <div className="text-xs font-semibold text-slate-900">{pref.preferences || pref.name}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                        {pref.createdAt ? new Date(pref.createdAt).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-3">
                        {editId === prefId ? (
                          <>
                            <button
                              onClick={() => handleEditSave(prefId)}
                              className="text-green-600 hover:text-green-800 transition-colors font-semibold"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditId(null)
                                setEditName("")
                              }}
                              className="text-slate-500 hover:text-slate-700 transition-colors font-semibold"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditId(prefId)
                                setEditName(pref.preferences || pref.name || "")
                              }}
                              className="text-green-600 hover:text-green-800 transition-colors font-semibold"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(prefId)}
                              className="text-rose-600 hover:text-rose-800 transition-colors font-semibold"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-400 font-medium text-xs">
                    No preferences found. Add one using the input above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default PlacePreferences
