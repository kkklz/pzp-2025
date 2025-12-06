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
  let authSubscription: { data: { subscription: { unsubscribe: () => void } } } | null = null

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

  function setupAuthListener() {
    if (authSubscription)
      authSubscription.data.subscription.unsubscribe()

    const sub = supabase.auth.onAuthStateChange(async (event, session) => {
      loading.value = true

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

    authSubscription = sub as any

    return () => {
      try {
        sub.data.subscription.unsubscribe()
      }
      catch {}
    }
  }

  return { authUser, loading, error, register, login, logout, setupAuthListener }
})
