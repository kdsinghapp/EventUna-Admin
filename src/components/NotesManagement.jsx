"use client"

import { useState, useEffect } from "react"
import apiService from "../services/api"

const NotesManagement = () => {
  const [note, setNote] = useState("")
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchNotes = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getNotes();
      if (response.status && Array.isArray(response.data)) {
        setNotes(
          response.data.map((item) => ({
            id: item._id,
            content: item.notes,
            createdAt: item.createdAt ? new Date(item.createdAt).toLocaleString() : "", // Use API createdAt if available
            author: "Admin", // API does not provide author
          }))
        )
      }
    } catch (err) {
      console.error("Error fetching notes:", err)
      setError("Failed to fetch notes.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  const handleAddNote = async (e) => {
    e.preventDefault()
    if (note.trim()) {
      try {
        setError(null)
        const response = await apiService.addNote({ notes: note })
        if (response.status) {
          setNote("")
          fetchNotes() // Refresh notes list from backend
        } else {
          setError("Failed to add note.")
        }
      } catch (err) {
        console.error("Error adding note:", err)
        setError("Failed to add note.")
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Notes Management</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error: </strong>
          <span className="inline">{error}</span>
        </div>
      )}

      {/* Add Note Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Note</h2>
        <form onSubmit={handleAddNote} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Note Content</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Enter note content..."
              required
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Add Note
          </button>
        </form>
      </div>

      {/* Notes List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Notes ({notes.length})</h2>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No notes found.</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notes.map((noteItem) => (
              <div key={noteItem.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-gray-900 mb-2">{noteItem.content}</p>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span>By {noteItem.author}</span>
                      {noteItem.createdAt && <span>{noteItem.createdAt}</span>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="text-blue-600 hover:text-blue-900 text-sm">Edit</button>
                    <button className="text-red-600 hover:text-red-900 text-sm">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default NotesManagement
