
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ilavaqzlwppxuczgvdsq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsYXZhcXpsd3BweHVjemd2ZHNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2OTI4MjAsImV4cCI6MjA2NDI2ODgyMH0.7cKmDsAzxA2bv9Q8VAq4XTg7BOq-_9h5l997Pac2gOE';

// Create client with proper configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

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
