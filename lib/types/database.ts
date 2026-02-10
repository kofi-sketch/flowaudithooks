export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ContentType = 'hook' | 'bridge' | 'followup'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          is_admin: boolean
          created_at: string
        }
        Insert: {
          id: string
          email: string
          is_admin?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          is_admin?: boolean
          created_at?: string
        }
      }
      hooks: {
        Row: {
          id: string
          text: string
          total_votes: number
          green_votes: number
          red_votes: number
          green_percentage: number
          is_flagged: boolean
          created_by: string | null
          created_at: string
          updated_at: string
          content_type: ContentType
        }
        Insert: {
          id?: string
          text: string
          total_votes?: number
          green_votes?: number
          red_votes?: number
          is_flagged?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
          content_type?: ContentType
        }
        Update: {
          id?: string
          text?: string
          total_votes?: number
          green_votes?: number
          red_votes?: number
          is_flagged?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
          content_type?: ContentType
        }
      }
      votes: {
        Row: {
          id: string
          hook_id: string
          vote_type: 'green' | 'red' | 'star'
          session_id: string
          created_at: string
        }
        Insert: {
          id?: string
          hook_id: string
          vote_type: 'green' | 'red' | 'star'
          session_id: string
          created_at?: string
        }
        Update: {
          id?: string
          hook_id?: string
          vote_type?: 'green' | 'red' | 'star'
          session_id?: string
          created_at?: string
        }
      }
    }
    Functions: {
      get_random_hook: {
        Args: {
          excluded_ids?: string[]
          p_content_type?: ContentType
        }
        Returns: {
          id: string
          text: string
          total_votes: number
          green_votes: number
          red_votes: number
          green_percentage: number
          is_flagged: boolean
          created_at: string
          content_type: ContentType
        }[]
      }
    }
  }
}

export type Hook = Database['public']['Tables']['hooks']['Row']
export type Vote = Database['public']['Tables']['votes']['Row']
export type User = Database['public']['Tables']['users']['Row']
