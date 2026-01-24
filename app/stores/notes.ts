import type { QueryError } from '@supabase/supabase-js'
import type { Note } from '~/types/note'

export const useNoteStore = defineStore('note', () => {
  const note = ref<Note | null>(null)
  const notes = ref<Note[]>([])
  const error = ref<QueryError | null>(null)
  const loading = ref(false)

  const supabase = useSupabaseClient()

  const NOTES = 'notes'

  async function addNote(noteData: Omit<Note, 'id' | 'created_at'>) {
    error.value = null
    loading.value = true
    const { error: err } = await supabase.from(NOTES).insert({
      ...noteData,
    }).select().single()

    if (err) {
      error.value = err
    }

    loading.value = false
  }

  async function fetchTeamNotes(teamId: string) {
    error.value = null
    loading.value = true
    const { data, error: err } = await supabase.from(NOTES).select().eq('team_id', teamId)

    if (err) {
      error.value = err
    }
    else {
      notes.value = data
    }
    loading.value = false
  }

  async function fetchNoteById(noteId: string) {
    error.value = null
    loading.value = true
    const { data, error: err } = await supabase.from(NOTES).select().eq('id', noteId).single()

    if (err) {
      error.value = err
    }
    else {
      note.value = data
    }
    loading.value = false
  }

  async function updateNote(noteId: string, { title, content }: { title?: string, content?: string }) {
    if (!title && content === undefined) {
      return
    }

    error.value = null
    loading.value = true
    const { data, error: err } = await supabase.from(NOTES).update({
      title,
      content,
    }).eq('id', noteId).select().single()

    if (err) {
      error.value = err
    }
    else {
      note.value = data
    }
    loading.value = false
  }

  async function deleteNote(noteId: string) {
    error.value = null
    loading.value = true
    const { error: err } = await supabase.from(NOTES).delete().eq('id', noteId)

    if (err) {
      error.value = err
    }
    loading.value = false
  }

  return {
    note,
    notes,
    error,
    loading,
    addNote,
    fetchTeamNotes,
    fetchNoteById,
    updateNote,
    deleteNote,
  }
})
