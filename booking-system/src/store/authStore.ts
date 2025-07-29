import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>
  logout: () => void
  setLoading: (loading: boolean) => void
}

// Mock authentication service
const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const users = [
    { id: '1', email: 'admin@example.com', password: 'admin123', firstName: 'Admin', lastName: 'User', phone: '081-234-5678' },
    { id: '2', email: 'john@example.com', password: 'john123', firstName: 'John', lastName: 'Doe', phone: '081-111-2222' },
    { id: '3', email: 'jane@example.com', password: 'jane123', firstName: 'Jane', lastName: 'Smith', phone: '081-333-4444' }
  ]
  
  const user = users.find(u => u.email === email && u.password === password)
  if (user) {
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }
  
  return null
}

const registerUser = async (userData: Omit<User, 'id'> & { password: string }): Promise<User | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // In real app, check if email already exists
  const newUser: User = {
    id: Date.now().toString(),
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    phone: userData.phone,
  }
  
  return newUser
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        
        try {
          const user = await authenticateUser(email, password)
          
          if (user) {
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false 
            })
            return true
          } else {
            set({ isLoading: false })
            return false
          }
        } catch (error) {
          set({ isLoading: false })
          return false
        }
      },

      register: async (userData) => {
        set({ isLoading: true })
        
        try {
          const user = await registerUser(userData)
          
          if (user) {
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false 
            })
            return true
          } else {
            set({ isLoading: false })
            return false
          }
        } catch (error) {
          set({ isLoading: false })
          return false
        }
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false 
        })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)