
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tracked_numbers: {
        Row: {
          id: string;
          user_id: string;
          phone_number: string;
          label: string;
          is_active: boolean;
          last_seen: string | null;
          call_count: number;
          text_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          phone_number: string;
          label: string;
          is_active?: boolean;
          last_seen?: string | null;
          call_count?: number;
          text_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          phone_number?: string;
          label?: string;
          is_active?: boolean;
          last_seen?: string | null;
          call_count?: number;
          text_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      contacts: {
        Row: {
          id: string;
          user_id: string;
          phone_number: string;
          name: string;
          email: string | null;
          address: string | null;
          notes: string | null;
          is_saved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          phone_number: string;
          name: string;
          email?: string | null;
          address?: string | null;
          notes?: string | null;
          is_saved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          phone_number?: string;
          name?: string;
          email?: string | null;
          address?: string | null;
          notes?: string | null;
          is_saved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      call_records: {
        Row: {
          id: string;
          user_id: string;
          phone_number: string;
          contact_name: string | null;
          duration: number;
          timestamp: string;
          type: 'incoming' | 'outgoing' | 'missed';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          phone_number: string;
          contact_name?: string | null;
          duration: number;
          timestamp: string;
          type: 'incoming' | 'outgoing' | 'missed';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          phone_number?: string;
          contact_name?: string | null;
          duration?: number;
          timestamp?: string;
          type?: 'incoming' | 'outgoing' | 'missed';
          created_at?: string;
        };
      };
      location_data: {
        Row: {
          id: string;
          user_id: string;
          phone_number: string;
          contact_name: string | null;
          latitude: number;
          longitude: number;
          accuracy: number;
          timestamp: string;
          address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          phone_number: string;
          contact_name?: string | null;
          latitude: number;
          longitude: number;
          accuracy: number;
          timestamp: string;
          address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          phone_number?: string;
          contact_name?: string | null;
          latitude?: number;
          longitude?: number;
          accuracy?: number;
          timestamp?: string;
          address?: string | null;
          created_at?: string;
        };
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string;
          phone_number: string;
          contact_name: string | null;
          activity_type: 'call' | 'text' | 'location' | 'app' | 'web';
          details: string;
          timestamp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          phone_number: string;
          contact_name?: string | null;
          activity_type: 'call' | 'text' | 'location' | 'app' | 'web';
          details: string;
          timestamp: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          phone_number?: string;
          contact_name?: string | null;
          activity_type?: 'call' | 'text' | 'location' | 'app' | 'web';
          details?: string;
          timestamp?: string;
          created_at?: string;
        };
      };
    };
  };
}
