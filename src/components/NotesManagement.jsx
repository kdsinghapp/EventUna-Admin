"use client"

import { useState, useEffect } from "react"
import API from "../api/axios"

const NotesManagement = () => {
  const [note, setNote] = useState("")
  const [notes, setNotes] = useState([])
  const [token, setToken] = useState(localStorage.getItem("token") || "")
  const [showTokenInput, setShowTokenInput] = useState(!token)

  useEffect(() => {
    if (!token) return;
    const fetchNotes = async () => {
      try {
        const res = await API.get("/event/notes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.status && Array.isArray(res.data.data)) {
          setNotes(
            res.data.data.map((item) => ({
              id: item._id,
              content: item.notes,
              createdAt: "", // API does not provide createdAt
              author: "", // API does not provide author
            }))
          )
        }
      } catch (err) {
        // Optionally handle error
      }
    }
    fetchNotes()
  }, [token])

  const handleTokenSave = (e) => {
    e.preventDefault()
    if (token.trim()) {
      localStorage.setItem("token", token)
      setShowTokenInput(false)
    }
  }

  const handleAddNote = (e) => {
    e.preventDefault()
    if (note.trim()) {
      const newNote = {
        id: Date.now().toString(),
        content: note,
        createdAt: new Date().toLocaleString(),
        author: "Admin",
      }
      setNotes((prev) => [newNote, ...prev])
      setNote("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Notes Management</h1>
      </div>

      {showTokenInput && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Token missing!</strong>
          <span className="block"> Please enter your API token to continue.</span>
          <form onSubmit={handleTokenSave} className="mt-2 flex items-center space-x-2">
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter token..."
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Token
            </button>
          </form>
        </div>
      )}

      {/* Add Note Form */}
      {!showTokenInput && (
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
      )}

      {/* Notes List */}
      {!showTokenInput && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Notes ({notes.length})</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {notes.map((noteItem) => (
              <div key={noteItem.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-gray-900 mb-2">{noteItem.content}</p>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span>By {noteItem.author}</span>
                      <span>{noteItem.createdAt}</span>
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
        </div>
      )}
    </div>
  )
}

export default NotesManagement
