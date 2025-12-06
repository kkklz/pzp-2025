import type { PostgrestError } from '@supabase/supabase-js'
import type User from '~/types/user'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('User', () => {
  const user: Ref<User | null> = ref(null)
  const users: Ref<User[]> = ref([])
  const error: Ref<PostgrestError | null> = ref(null)
  const loading = ref(false)

  const supabase = useSupabaseClient()
  const USER = 'users'

  function clearStore() {
    user.value = null
    error.value = null
  }

  async function addUser(userData: Omit<User, 'id'>) {
    const { data, error: err } = await supabase.from(USER).insert(userData).select().limit(1).single()

    if (err || data == null) {
      error.value = err

      return
    }

    user.value = data as User
  }

  async function fetchUser(userId: string) {
    const { data, error: err } = await supabase.from(USER).select().eq('id', userId).limit(1).single()

    if (err || data == null) {
      error.value = err

      return
    }

    user.value = data as User
    user.value.photoUrl = data.photoUrl
      ? `${data.photoUrl}?t=${Date.now()}`
      : null
  }

  async function fetchUsers() {
    error.value = null
    loading.value = true

    try {
      const { data, error: err } = await supabase.from(USER).select()
      if (err)
        throw err

      users.value = data as User[] || []
    }
    catch (err: any) {
      error.value = err
    }
    finally {
      loading.value = false
    }
  }

  async function updateUser(userId: string, userData: Partial<Omit<User, 'id'>>, avatarFile?: File) {
    error.value = null
    loading.value = true

    try {
      if (avatarFile) {
        const { error: avatarError } = await supabase.storage.from('media').upload(`users/${userId}`, avatarFile, {
          upsert: true,
        })
        if (avatarError) {
          throw avatarError
        }
        const { data: photoData } = supabase.storage.from('media').getPublicUrl(`users/${userId}`)
        userData.photoUrl = photoData.publicUrl
      }

      const { data, error: err } = await supabase.from(USER).update({
        ...userData,
      }).eq('id', userId).select().single()

      if (err || data == null)
        throw err

      if (data.id === user.value?.id) {
        user.value = data as User
      }
    }
    catch (err: any) {
      error.value = err
    }
    finally {
      loading.value = false
    }
  }

  return { user, users, error, loading, fetchUser, fetchUsers, addUser, updateUser, clearStore }
})
