import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          country: string
          city: string
          avatar_url: string | null
          is_verified: boolean
          rating: number
          total_trips: number
          total_packages: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          phone?: string | null
          country: string
          city: string
          avatar_url?: string | null
          is_verified?: boolean
          rating?: number
          total_trips?: number
          total_packages?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string | null
          country?: string
          city?: string
          avatar_url?: string | null
          is_verified?: boolean
          rating?: number
          total_trips?: number
          total_packages?: number
          created_at?: string
          updated_at?: string
        }
      }
      package_requests: {
        Row: {
          id: string
          sender_id: string
          title: string
          description: string
          from_country: string
          from_city: string
          to_country: string
          to_city: string
          weight: number
          dimensions: string | null
          compensation: number
          currency: string
          deadline: string
          status: 'active' | 'matched' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          title: string
          description: string
          from_country: string
          from_city: string
          to_country: string
          to_city: string
          weight: number
          dimensions?: string | null
          compensation: number
          currency?: string
          deadline: string
          status?: 'active' | 'matched' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          title?: string
          description?: string
          from_country?: string
          from_city?: string
          to_country?: string
          to_city?: string
          weight?: number
          dimensions?: string | null
          compensation?: number
          currency?: string
          deadline?: string
          status?: 'active' | 'matched' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      trips: {
        Row: {
          id: string
          traveler_id: string
          from_country: string
          from_city: string
          to_country: string
          to_city: string
          departure_date: string
          arrival_date: string
          available_weight: number
          price_per_kg: number
          currency: string
          notes: string | null
          status: 'active' | 'booked' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          traveler_id: string
          from_country: string
          from_city: string
          to_country: string
          to_city: string
          departure_date: string
          arrival_date: string
          available_weight: number
          price_per_kg: number
          currency?: string
          notes?: string | null
          status?: 'active' | 'booked' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          traveler_id?: string
          from_country?: string
          from_city?: string
          to_country?: string
          to_city?: string
          departure_date?: string
          arrival_date?: string
          available_weight?: number
          price_per_kg?: number
          currency?: string
          notes?: string | null
          status?: 'active' | 'booked' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}