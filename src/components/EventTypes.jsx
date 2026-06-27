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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Intro */}
      <div className="pb-6 border-b border-slate-100">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Event Types & Categories
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure event classifications and group sub-services under targeted categories.
        </p>
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

      {/* Grid container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Create / Setup forms */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Card 1: Add Event Type */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">
                Create Event Type
              </h3>
            </div>
            
            <form onSubmit={handleAddEventType} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Event Type Name
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={eventTypeName}
                    onChange={(e) => setEventTypeName(e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm placeholder-slate-400"
                    placeholder="e.g. Wedding, Birthday"
                    required
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow active:scale-98 shrink-0 disabled:opacity-50"
                    disabled={formSubmitting || !eventTypeName.trim()}
                  >
                    {formSubmitting ? "Adding..." : "Add"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Card 2: Add Category */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">
                Add Category
              </h3>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Associated Event Type
                </label>
                <select
                  value={categoryEventType}
                  onChange={(e) => setCategoryEventType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-800 bg-white"
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

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm placeholder-slate-400"
                  placeholder="e.g. Outdoor, Indoor Banquet"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow active:scale-98 disabled:opacity-50"
                  disabled={formSubmitting || !categoryName.trim() || !categoryEventType}
                >
                  {formSubmitting ? "Adding Category..." : "Add Category"}
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Right Side: Listing and Badges */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                Registered Event Types & Categories ({eventTypes.length})
              </h3>
            </div>

            {loading && eventTypes.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin"></div>
              </div>
            ) : eventTypes.length > 0 ? (
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                {eventTypes.map((eventType) => {
                  const eventTypeCategories = getEventCategories(eventType._id || eventType.id)
                  
                  return (
                    <div 
                      key={eventType._id || eventType.id} 
                      className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl p-5 transition-all duration-150"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-bold text-indigo-600 flex items-center gap-2">
                          {eventType.eventType || eventType.name}
                        </h4>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-200/50 px-2 py-0.5 rounded">
                          {eventTypeCategories.length} Categories
                        </span>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-slate-100/60">
                        <div className="flex flex-wrap gap-2">
                          {eventTypeCategories.length > 0 ? (
                            eventTypeCategories.map((category) => (
                              <span 
                                key={category._id || category.id} 
                                className="inline-flex items-center px-3 py-1 bg-white border border-slate-200/60 text-slate-700 text-xs font-semibold rounded-lg shadow-xs hover:border-slate-350 transition-colors"
                              >
                                {category.category || category.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400 italic">No categories assigned to this event type yet.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 font-medium">
                No event classifications found.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default EventTypes

