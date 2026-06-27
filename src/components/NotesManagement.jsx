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
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Info */}
      <div className="pb-6 border-b border-slate-100">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Notes Management</h1>
        <p className="text-sm text-slate-500 mt-1">Write, archive, and manage administrative notes for system updates.</p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3.5 rounded-xl flex items-center gap-3 text-sm animate-fade-in shadow-xs">
          <svg className="w-5 h-5 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                All Notes ({notes.length})
              </h3>
            </div>

            {loading && notes.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin"></div>
              </div>
            ) : notes.length > 0 ? (
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                {notes.map((noteItem) => (
                  <div
                    key={noteItem.id}
                    className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl p-5 transition-all duration-150 relative group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <p className="text-sm text-slate-700 leading-relaxed font-medium break-words">
                          {noteItem.content}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-semibold pt-2 border-t border-slate-100/50">
                          <span className="flex items-center gap-1 bg-slate-200/50 px-2 py-0.5 rounded text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                            By {noteItem.author}
                          </span>
                          {noteItem.createdAt && (
                            <span className="text-slate-400 font-medium">
                              {noteItem.createdAt}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Small floating actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleStartEdit(noteItem)}
                          className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 rounded-lg transition-colors border border-indigo-100"
                          title="Edit Note"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setNoteToDelete(noteItem.id)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 rounded-lg transition-colors border border-rose-100"
                          title="Delete Note"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 font-medium">
                No notes found. Create your first note on the left.
              </div>
            )}
          </div>
        </div>
        {/* Left Side: Create Form */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">Add New Note</h2>
            </div>

            <form onSubmit={handleAddNote} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Note Content</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm placeholder-slate-400 resize-none leading-relaxed"
                  rows="5"
                  placeholder="Type note details here..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow active:scale-98 disabled:opacity-50"
                disabled={formSubmitting || !note.trim()}
              >
                {formSubmitting ? "Saving Note..." : "Add Note"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: List of Notes */}


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
                  className="px-4 py-2.5 text-sm font-semibold text-slate-650 hover:bg-slate-50 rounded-xl transition-all"
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

