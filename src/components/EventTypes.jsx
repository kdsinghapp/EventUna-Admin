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
  const [message, setMessage] = useState("")

  const handleAddEventType = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    try {
      await ApiService.addEventType({ eventType: eventTypeName })
      setMessage("Event type added successfully")
      setEventTypeName("")
    } catch (err) {
      setMessage("Failed to add event type")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    try {
      // Send both category and eventTypeId in one request
      await ApiService.addEventCategory(categoryName, categoryEventType)
      setMessage("Event category added successfully")
      setCategoryName("")
      setCategoryEventType("")
    } catch (err) {
      setMessage("Failed to add event category")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
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

    fetchData()
  }, [message])

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-md shadow">
      <h2 className="text-xl font-semibold mb-4">Add Event Type & Category</h2>

      {message && <div className="mb-4 text-sm text-green-700">{message}</div>}

      <form onSubmit={handleAddEventType} className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Event Type Name</label>
        <div className="flex mt-2">
          <input
            type="text"
            value={eventTypeName}
            onChange={(e) => setEventTypeName(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-l-md"
            placeholder="e.g. Wedding"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-r-md"
            disabled={loading}
          >
            {loading ? "Saving..." : "Add Type"}
          </button>
        </div>
      </form>

      <form onSubmit={handleAddCategory}>
           <label className="block text-sm font-medium text-gray-700 mt-3">Associated Event Type</label>
        <select
          value={categoryEventType}
          onChange={(e) => setCategoryEventType(e.target.value)}
          className="w-full mt-2 px-3 py-2 border rounded-md"
          required
        >
          <option value="">Select event type</option>
          {eventTypes.map((et) => (
            <option key={et._id || et.id || et.value} value={et._id || et.id || et.value}>
              {et.name || et.eventType || et.title || et.type}
            </option>
          ))}
        </select>
        <label className="block text-sm font-medium text-gray-700">Category Name</label>
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="w-full mt-2 px-3 py-2 border rounded-md"
          placeholder="e.g. Outdoor"
          required
        />

     

        <div className="mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md"
            disabled={loading}
          >
            {loading ? "Saving..." : "Add Category"}
          </button>
        </div>
      </form>

      {/* Display Events and Categories */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Event Types and Categories</h3>
        {eventTypes.map((eventType) => (
          <div key={eventType._id} className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h4 className="text-md font-semibold text-blue-600">
              {eventType.eventType}
            </h4>
            <div className="ml-4 mt-2">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Categories:</h5>
              <ul className="list-disc list-inside">
                {categories
                  .filter((cat) => cat.eventType._id === eventType._id)
                  .map((category) => (
                    <li key={category._id} className="text-sm text-gray-600 ml-2">
                      {category.category}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EventTypes
