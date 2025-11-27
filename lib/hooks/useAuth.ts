import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [supabase.auth])

    return {
        user,
        loading,
        signUp: async (email: string, password: string, name?: string) => {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: name || email.split('@')[0],
                    },
                },
            })

            if (error) throw error

            // Create user profile in database (Supabase Auth automatically creates the user)
            // The auth.users table is separate from our custom users table
            if (data.user) {
                const { error: insertError } = await supabase.from('users').insert({
                    id: data.user.id,
                    email: data.user.email!,
                    name: name || email.split('@')[0],
                })

                if (insertError) {
                    console.error('Error creating user profile:', insertError)
                    // Don't throw here - auth user is created, profile can be created later
                }
            }

            return data
        },

        signIn: async (email: string, password: string) => {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error
            return data
        },

        signOut: async () => {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
        },

        resetPassword: async (email: string) => {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            })

            if (error) throw error
        },

        updatePassword: async (newPassword: string) => {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            })

            if (error) throw error
        },
    }
}
