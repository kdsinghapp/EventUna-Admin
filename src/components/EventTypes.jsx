"use client"

import { useState, useEffect } from "react"
import ApiService from "../services/api"

const EventTypes = () => {
  const [eventTypeName, setEventTypeName] = useState("")
  const [categoryName, setCategoryName] = useState("")
  const [categoryEventType, setCategoryEventType] = useState("")
  const [eventTypes, setEventTypes] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("success") // "success" | "error"

  const handleAddEventType = async (e) => {
    e.preventDefault()
    if (!eventTypeName.trim()) return
    setFormSubmitting(true)
    setMessage("")
    try {
      await ApiService.addEventType({ eventType: eventTypeName })
      setMessageType("success")
      setMessage("Event type added successfully")
      setEventTypeName("")
      // Trigger data refresh
      fetchData()
    } catch (err) {
      setMessageType("error")
      setMessage("Failed to add event type")
      console.error(err)
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!categoryName.trim() || !categoryEventType) return
    setFormSubmitting(true)
    setMessage("")
    try {
      await ApiService.addEventCategory(categoryName, categoryEventType)
      setMessageType("success")
      setMessage("Category added successfully")
      setCategoryName("")
      setCategoryEventType("")
      // Trigger data refresh
      fetchData()
    } catch (err) {
      setMessageType("error")
      setMessage("Failed to add event category")
      console.error(err)
    } finally {
      setFormSubmitting(false)
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      // Fetch event types
      const eventData = await ApiService.getEventTypes()
      let types = []
      if (Array.isArray(eventData)) types = eventData
      else if (eventData?.eventTypes) types = eventData.eventTypes
      else if (eventData?.data) types = eventData.data
      setEventTypes(types)

      // Fetch all categories
      const categoryData = await ApiService.getAllEventCategories()
      if (categoryData?.data) {
        setCategories(categoryData.data)
      }
    } catch (err) {
      console.error("Failed to fetch data", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Safely extract categories matching the event type ID
  const getEventCategories = (eventTypeId) => {
    return categories.filter((cat) => {
      if (!cat.eventType) return false
      const id = typeof cat.eventType === "object" ? cat.eventType._id || cat.eventType.id : cat.eventType
      return id === eventTypeId
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Info and Actions Grid at the Top */}
      <div className="pb-6 border-b border-slate-200 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-950 tracking-tight">Event Types & Categories</h1>
          <p className="text-xs text-slate-500 mt-0.5">Configure event classifications and group sub-services under targeted categories.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-end">
          {/* Form 1: Add Event Type */}
          <form onSubmit={handleAddEventType} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                New Event Type
              </label>
              <input
                type="text"
                value={eventTypeName}
                onChange={(e) => setEventTypeName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm placeholder-slate-400"
                placeholder="e.g. Wedding, Birthday"
                required
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all shadow-sm shrink-0"
              disabled={formSubmitting || !eventTypeName.trim()}
            >
              {formSubmitting ? "Adding..." : "Add Type"}
            </button>
          </form>

          {/* Form 2: Add Category */}
          <form onSubmit={handleAddCategory} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-end gap-3">
            <div className="flex-1 w-full">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Event Type
              </label>
              <select
                value={categoryEventType}
                onChange={(e) => setCategoryEventType(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-800 bg-white"
                required
              >
                <option value="">Select event type</option>
                {eventTypes.map((et) => (
                  <option key={et._id || et.id} value={et._id || et.id}>
                    {et.name || et.eventType || et.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 w-full">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Category Name
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm placeholder-slate-400"
                placeholder="e.g. Banquet, Catering"
                required
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-all shadow-sm shrink-0 w-full sm:w-auto"
              disabled={formSubmitting || !categoryName.trim() || !categoryEventType}
            >
              {formSubmitting ? "Adding..." : "Add Category"}
            </button>
          </form>
        </div>
      </div>

      {/* Global Status/Message Banner */}
      {message && (
        <div className={`px-4 py-3.5 rounded-xl border text-sm font-semibold flex items-center gap-3 animate-fade-in shadow-xs ${
          messageType === "success" 
            ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
            : "bg-rose-50 border-rose-200 text-rose-800"
        }`}>
          {messageType === "success" ? (
            <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          {message}
        </div>
      )}

      {/* Downside Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider w-4/12">
                  Event Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider w-8/12">
                  Assigned Categories
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {loading && eventTypes.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-8 h-8 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin"></div>
                      <p className="text-xs font-medium text-slate-400">Loading data...</p>
                    </div>
                  </td>
                </tr>
              ) : eventTypes.length > 0 ? (
                eventTypes.map((eventType) => {
                  const eventTypeCategories = getEventCategories(eventType._id || eventType.id)
                  
                  return (
                    <tr key={eventType._id || eventType.id} className="hover:bg-slate-50/70 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-indigo-600">
                          {eventType.eventType || eventType.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {eventTypeCategories.length > 0 ? (
                            eventTypeCategories.map((category) => (
                              <span 
                                key={category._id || category.id} 
                                className="inline-flex items-center px-2.5 py-0.5 bg-slate-50 border border-slate-200/60 text-slate-750 text-xs font-semibold rounded-lg"
                              >
                                {category.category || category.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400 italic">No categories assigned yet.</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-slate-400 font-medium text-xs">
                    No event classifications found.
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

export default EventTypes

