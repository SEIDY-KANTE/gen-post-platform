import { createBrowserClient } from '@supabase/ssr'

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          credits: number
          plan: 'free' | 'premium' | 'pro'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          avatar_url?: string | null
          credits?: number
          plan?: 'free' | 'premium' | 'pro'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          credits?: number
          plan?: 'free' | 'premium' | 'pro'
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          template_id: string | null
          platform: string | null
          thumbnail_url: string | null
          author: string | null
          design_config: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          template_id?: string | null
          platform?: string | null
          thumbnail_url?: string | null
          author?: string | null
          design_config?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          template_id?: string | null
          platform?: string | null
          thumbnail_url?: string | null
          author?: string | null
          design_config?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: 'purchase' | 'subscription' | 'refund'
          amount: number | null
          credits: number | null
          stripe_payment_id: string | null
          stripe_session_id: string | null
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'purchase' | 'subscription' | 'refund'
          amount?: number | null
          credits?: number | null
          stripe_payment_id?: string | null
          stripe_session_id?: string | null
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'purchase' | 'subscription' | 'refund'
          amount?: number | null
          credits?: number | null
          stripe_payment_id?: string | null
          stripe_session_id?: string | null
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          metadata?: Json | null
          created_at?: string
        }
      }
    }
  }
}

/**
 * Browser-side Supabase client
 * Use this in React components and client-side code
 */
export const createClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
