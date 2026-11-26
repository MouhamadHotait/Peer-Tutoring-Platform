import { createContext, useContext, useState } from 'react'
import { apiRequest } from '../api/client'
import { users as mockUsers } from '../data/mockData' // TEMPORARY, see getUserById below

const AuthContext = createContext(null)

// On page load, restore the logged-in user saved in the browser (if any)
function loadSavedUser() {
  try {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(loadSavedUser) // null = nobody logged in

  // Save the token (used by apiRequest) and the user, so a refresh keeps them logged in
  function saveLogin(user, token) {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setCurrentUser(user)
  }

  // LOGIN: backend checks the password with bcrypt and returns { user, token }
  // Returns { ok: true } or { ok: false, error: '...' } (same shape as Phase 1)
  async function login(email, password) {
    try {
      const data = await apiRequest('/auth/login', { method: 'POST', body: { email, password } })
      saveLogin(data.user, data.token)
      return { ok: true }
    } catch (error) {
      return { ok: false, error: error.message }
    }
  }

  // REGISTER: backend creates the user (password hashed) and returns { user, token }
  async function register(formData) {
    try {
      const data = await apiRequest('/auth/register', { method: 'POST', body: formData })
      saveLogin(data.user, data.token)
      return { ok: true }
    } catch (error) {
      return { ok: false, error: error.message }
    }
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setCurrentUser(null)
  }

  // After editing their profile, the page calls this so the navbar etc. show the new info
  function updateCurrentUser(user) {
    localStorage.setItem('user', JSON.stringify(user))
    setCurrentUser(user)
  }

  // TEMPORARY: keeps Phase 1 pages working until each owner switches to the API.
  // Delete this (and the mockUsers import) once no page uses getUserById.
  const getUserById = (id) => mockUsers.find((u) => u.id === Number(id))

  const value = { currentUser, login, register, logout, updateCurrentUser, getUserById }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Shortcut for pages: const { currentUser, login } = useAuth()
export function useAuth() {
  return useContext(AuthContext)
}