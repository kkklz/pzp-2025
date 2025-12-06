import type { User as SupabaseUser } from '@supabase/supabase-js'
import type User from '~/types/user'
import { AuthError } from '@supabase/supabase-js'
import { defineStore } from 'pinia'
import { useUserStore } from './user'

type RegisterUser = Omit<User, 'id'>

export const useAuthStore = defineStore('auth', () => {
  const authUser: Ref<SupabaseUser | null> = ref(null)
  const loading: Ref<boolean> = ref(false)
  const error: Ref<AuthError | null> = ref(null)

  const supabase = useSupabaseClient()

  const userStore = useUserStore()
  const { user } = storeToRefs(userStore)

  async function register(email: string, password: string, userData: RegisterUser) {
    error.value = null

    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
    })

    if (err) {
      error.value = err

      return
    }

    if (data.user == null) {
      error.value = new AuthError('No user')

      return
    }

    userStore.addUser({
      ...userData,
    })

    authUser.value = data.user
  }

  async function login(email: string, password: string) {
    error.value = null
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (err) {
      error.value = err

      return
    }

    authUser.value = data.user
  }

  async function logout() {
    error.value = null
    const { error: err } = await supabase.auth.signOut()
    authUser.value = null
    if (err) {
      error.value = err

      return
    }

    userStore.clearStore()
  }

  async function setupAuthListener() {
    loading.value = true
    try {
      const { data: { user: u } } = await supabase.auth.getUser()
      authUser.value = u
    }
    catch {}

    const sub = supabase.auth.onAuthStateChange(async (event, session) => {
      authUser.value = session?.user || null

      if (event === 'SIGNED_OUT' || !authUser.value) {
        userStore.clearStore()
        loading.value = false

        return
      }

      if (authUser.value && user.value === null) {
        await userStore.fetchUser(authUser.value.id)
      }
      loading.value = false
    })

    return () => {
      try {
        sub.data.subscription.unsubscribe()
      }
      catch {}
    }
  }

  return { authUser, loading, error, register, login, logout, setupAuthListener }
})
