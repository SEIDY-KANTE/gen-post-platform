import { create } from "zustand"
import { createClient } from "@/lib/supabase/client"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  credits: number
  plan: "free" | "premium" | "pro"
}

export interface GeneratedPost {
  id: string
  title: string
  content: string
  template: string
  platform: string
  createdAt: Date
  thumbnail?: string
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
  consumeCredit: () => Promise<boolean>
  addCredits: (amount: number) => void
  addPost: (post: Omit<GeneratedPost, "id" | "createdAt">) => Promise<void>
  deletePost: (id: string) => Promise<void>
  updatePlan: (plan: "free" | "premium" | "pro", credits?: number) => void
  fetchUser: (userId: string) => Promise<void>
  fetchPosts: (userId: string) => Promise<void>
  logout: () => Promise<void>
}

export const useAppStore = create<AppState>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  posts: [],

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  fetchUser: async (userId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single()

    if (error) {
      // If user not found (PGRST116), try to create it from auth data
      if (error.code === 'PGRST116') {
        console.log("User profile not found, attempting to create...")

        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

        if (authError || !authUser) {
          console.error("Error fetching auth user:", authError)
          return
        }

        // Create missing profile
        const { data: newProfile, error: createError } = await supabase
          .from('users')
          .insert({
            id: userId,
            email: authUser.email!,
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0],
            credits: 5 // Default credits
          })
          .select()
          .single()

        if (createError) {
          console.error("Error creating missing profile:", createError)
          return
        }

        // Set user in store
        if (newProfile) {
          set({
            user: {
              id: newProfile.id,
              name: newProfile.name || "",
              email: newProfile.email,
              avatar: newProfile.avatar_url || undefined,
              credits: newProfile.credits,
              plan: newProfile.plan as "free" | "premium" | "pro",
            },
            isAuthenticated: true,
          })
        }
        return
      }

      console.error("Error fetching user:", error)
      return
    }

    if (data) {
      set({
        user: {
          id: data.id,
          name: data.name || "",
          email: data.email,
          avatar: data.avatar_url || undefined,
          credits: data.credits,
          plan: data.plan as "free" | "premium" | "pro",
        },
        isAuthenticated: true,
      })
    }
  },

  fetchPosts: async (userId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching posts:", error)
      return
    }

    if (data) {
      const posts: GeneratedPost[] = data.map((post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        template: post.template_id || "",
        platform: post.platform || "",
        createdAt: new Date(post.created_at),
        thumbnail: post.thumbnail_url || undefined,
        author: post.author || undefined,
        ...(post.design_config as object),
      }))
      set({ posts })
    }
  },

  consumeCredit: async () => {
    const { user } = get()
    if (!user || user.credits <= 0) return false

    const supabase = createClient()

    // Use the atomic deduct_credit function
    const { data, error } = await supabase.rpc("deduct_credit", {
      user_id: user.id,
    })

    if (error || !data) {
      console.error("Error deducting credit:", error)
      return false
    }

    // Update local state
    set({ user: { ...user, credits: user.credits - 1 } })
    return true
  },

  addCredits: (amount) => {
    const { user } = get()
    if (!user) return
    set({ user: { ...user, credits: user.credits + amount } })
  },

  addPost: async (post) => {
    const { user } = get()
    if (!user) return

    const supabase = createClient()

    // Prepare data for Supabase
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbPost: any = {
      user_id: user.id,
      title: post.title,
      content: post.content,
      template_id: post.template,
      platform: post.platform,
      thumbnail_url: post.thumbnail,
      author: post.author,
      design_config: {
        gradient: post.gradient,
        backgroundColor: post.backgroundColor,
        borderColor: post.borderColor,
        borderWidth: post.borderWidth,
        textColor: post.textColor,
        accentColor: post.accentColor,
        fontFamily: post.fontFamily,
        fontWeight: post.fontWeight,
        fontSize: post.fontSize,
        textAlign: post.textAlign,
        padding: post.padding,
        backgroundImage: post.backgroundImage,
      },
    }

    const { data, error } = await supabase
      .from("posts")
      .insert(dbPost)
      .select()
      .single()

    if (error) {
      console.error("Error saving post:", error)
      return
    }

    if (data) {
      const newPost: GeneratedPost = {
        id: data.id,
        title: data.title,
        content: data.content,
        template: data.template_id || "",
        platform: data.platform || "",
        createdAt: new Date(data.created_at),
        thumbnail: data.thumbnail_url || undefined,
        author: data.author || undefined,
        ...(data.design_config as object),
      }
      set((state) => ({ posts: [newPost, ...state.posts] }))
    }
  },

  deletePost: async (id) => {
    const supabase = createClient()
    const { error } = await supabase.from("posts").delete().eq("id", id)

    if (error) {
      console.error("Error deleting post:", error)
      return
    }

    set((state) => ({
      posts: state.posts.filter((post) => post.id !== id),
    }))
  },

  updatePlan: (plan, credits) => {
    const { user } = get()
    if (!user) return
    set({
      user: {
        ...user,
        plan,
        credits: credits !== undefined ? user.credits + credits : user.credits,
      },
    })
  },

  logout: async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("Error signing out:", error)
      throw error
    }

    // Clear user state and posts
    set({ user: null, isAuthenticated: false, posts: [] })
  },
}))
