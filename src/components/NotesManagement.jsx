"use client"

import { useState, useEffect } from "react"
import apiService from "../services/api"

const NotesManagement = () => {
  const [note, setNote] = useState("")
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [noteToDelete, setNoteToDelete] = useState(null)
  const [noteToEdit, setNoteToEdit] = useState(null)
  const [editContent, setEditContent] = useState("")

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
            createdAt: item.createdAt ? new Date(item.createdAt).toLocaleString() : "",
            author: "Admin",
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
    if (!note.trim()) return
    try {
      setFormSubmitting(true)
      setError(null)
      const response = await apiService.addNote({ notes: note })
      if (response) {
        setNote("")
        fetchNotes()
      } else {
        setError("Failed to add note.")
      }
    } catch (err) {
      console.error("Error adding note:", err)
      setError("Failed to add note.")
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleDeleteLocal = async (id) => {
    try {
      setError(null)
      const response = await apiService.deleteNote(id)
      if (response && response.status !== false) {
        fetchNotes()
      } else {
        setError("Failed to delete note.")
      }
    } catch (err) {
      console.error("Error deleting note:", err)
      setError("Failed to delete note.")
    } finally {
      setNoteToDelete(null)
    }
  }

  const handleStartEdit = (noteItem) => {
    setNoteToEdit(noteItem)
    setEditContent(noteItem.content)
  }

  const handleUpdateNote = async (e) => {
    e.preventDefault()
    if (!editContent.trim()) return
    try {
      setFormSubmitting(true)
      setError(null)
      const response = await apiService.updateNote(noteToEdit.id, editContent)
      if (response) {
        setNoteToEdit(null)
        setEditContent("")
        fetchNotes()
      } else {
        setError("Failed to update note.")
      }
    } catch (err) {
      console.error("Error updating note:", err)
      setError("Failed to update note.")
    } finally {
      setFormSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Info and Add Note Inline Form */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-950 tracking-tight">Notes Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Write, archive, and manage administrative notes for system updates.</p>
        </div>

        {/* Input field and Add Note button inline */}
        <form onSubmit={handleAddNote} className="flex-1 max-w-xl flex items-center gap-3">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm placeholder-slate-400"
            placeholder="Type note details here..."
            required
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow shrink-0 flex items-center gap-2"
            disabled={formSubmitting || !note.trim()}
          >
            {formSubmitting ? "Adding..." : "Add Note"}
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

      {/* Downside Notes Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider w-7/12">
                  Note Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider w-2/12">
                  Created By
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider w-1/12">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {loading && notes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-8 h-8 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin"></div>
                      <p className="text-xs font-medium text-slate-400">Loading notes...</p>
                    </div>
                  </td>
                </tr>
              ) : notes.length > 0 ? (
                notes.map((noteItem) => (
                  <tr key={noteItem.id} className="hover:bg-slate-50/70 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <p className="text-xs font-semibold text-slate-900 break-words leading-relaxed whitespace-pre-wrap">
                        {noteItem.content}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100/50">
                        <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
                        {noteItem.author}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-3">
                      <button
                        onClick={() => handleStartEdit(noteItem)}
                        className="text-indigo-600 hover:text-indigo-800 transition-colors font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setNoteToDelete(noteItem.id)}
                        className="text-rose-600 hover:text-rose-800 transition-colors font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400 font-medium text-xs">
                    No notes found. Add a note using the input above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {noteToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-100 animate-scale-up">
            <h3 className="text-xl font-bold text-slate-950 mb-2">Delete Note</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to delete this administrative note? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setNoteToDelete(null)}
                className="px-4 py-2.5 text-sm font-semibold text-slate-650 hover:bg-slate-50 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteLocal(noteToDelete)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-all shadow-sm hover:shadow"
              >
                Delete Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {noteToEdit && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-100 animate-scale-up">
            <h3 className="text-xl font-bold text-slate-950 mb-4">Edit Note</h3>
            <form onSubmit={handleUpdateNote} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Note Content</label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none leading-relaxed"
                  rows="5"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setNoteToEdit(null)
                    setEditContent("")
                  }}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-655 hover:bg-slate-50 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-sm hover:shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotesManagement

