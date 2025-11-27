import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  credits: number
  plan: "free" | "pro" | "enterprise"
}

export interface GeneratedPost {
  id: string
  title: string
  content: string
  template: string
  platform: string
  createdAt: Date
  thumbnail?: string
  // Store all styling data for re-rendering
  author?: string
  gradient?: string
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  textColor?: string
  accentColor?: string
  fontFamily?: string
  fontWeight?: number
  fontSize?: number
  textAlign?: "left" | "center" | "right"
  padding?: number
  backgroundImage?: string
}

interface AppState {
  user: User | null
  isAuthenticated: boolean
  posts: GeneratedPost[]
  setUser: (user: User | null) => void
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  consumeCredit: () => boolean
  addCredits: (amount: number) => void
  addPost: (post: GeneratedPost) => void
  deletePost: (id: string) => void // Added deletePost
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      posts: [],

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      login: async (email: string, password: string) => {
        // Mock login - replace with real auth
        const mockUser: User = {
          id: "1",
          name: email.split("@")[0],
          email,
          credits: 5,
          plan: "free",
        }
        set({ user: mockUser, isAuthenticated: true })
        return true
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      consumeCredit: () => {
        const { user } = get()
        if (!user || user.credits <= 0) return false
        set({ user: { ...user, credits: user.credits - 1 } })
        return true
      },

      addCredits: (amount) => {
        const { user } = get()
        if (!user) return
        set({ user: { ...user, credits: user.credits + amount } })
      },

      addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),

      deletePost: (id) =>
        set((state) => ({
          posts: state.posts.filter((post) => post.id !== id),
        })),
    }),
    {
      name: "genpost-storage",
    },
  ),
)
