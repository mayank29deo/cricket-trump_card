import { create } from 'zustand'
import { supabase } from '../lib/supabase'

function generateGuestId() {
  return 'guest_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
}

function getStoredUser() {
  try {
    const stored = localStorage.getItem('cricket_user')
    if (stored) return JSON.parse(stored)
  } catch {
    // ignore
  }
  return null
}

const useAuthStore = create((set, get) => ({
  user: getStoredUser(),
  isGuest: getStoredUser()?.isGuest || false,
  isLoading: false,
  error: null,

  signIn: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      const user = {
        id: data.user.id,
        name: data.user.email.split('@')[0],
        email: data.user.email,
        isGuest: false
      }
      localStorage.setItem('cricket_user', JSON.stringify(user))
      set({ user, isGuest: false, isLoading: false })
      return { success: true }
    } catch (error) {
      set({ error: error.message, isLoading: false })
      return { success: false, error: error.message }
    }
  },

  signUp: async (email, password, name) => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      const user = {
        id: data.user.id,
        name: name || email.split('@')[0],
        email: data.user.email,
        isGuest: false
      }
      localStorage.setItem('cricket_user', JSON.stringify(user))
      set({ user, isGuest: false, isLoading: false })
      return { success: true }
    } catch (error) {
      set({ error: error.message, isLoading: false })
      return { success: false, error: error.message }
    }
  },

  continueAsGuest: (name) => {
    const user = {
      id: generateGuestId(),
      name: name || 'Guest Player',
      isGuest: true
    }
    localStorage.setItem('cricket_user', JSON.stringify(user))
    set({ user, isGuest: true, isLoading: false, error: null })
    return user
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut()
    } catch {
      // ignore supabase errors
    }
    localStorage.removeItem('cricket_user')
    set({ user: null, isGuest: false, error: null })
  },

  clearError: () => set({ error: null })
}))

export default useAuthStore
