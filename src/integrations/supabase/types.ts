export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          activity_type: string
          contact_name: string | null
          created_at: string | null
          details: string
          id: string
          phone_number: string
          timestamp: string
          user_id: string | null
        }
        Insert: {
          activity_type: string
          contact_name?: string | null
          created_at?: string | null
          details: string
          id?: string
          phone_number: string
          timestamp: string
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          contact_name?: string | null
          created_at?: string | null
          details?: string
          id?: string
          phone_number?: string
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      call_records: {
        Row: {
          contact_name: string | null
          created_at: string | null
          duration: number
          id: string
          phone_number: string
          timestamp: string
          type: string
          user_id: string | null
        }
        Insert: {
          contact_name?: string | null
          created_at?: string | null
          duration?: number
          id?: string
          phone_number: string
          timestamp: string
          type: string
          user_id?: string | null
        }
        Update: {
          contact_name?: string | null
          created_at?: string | null
          duration?: number
          id?: string
          phone_number?: string
          timestamp?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          id: string
          is_saved: boolean | null
          name: string
          notes: string | null
          phone_number: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_saved?: boolean | null
          name: string
          notes?: string | null
          phone_number: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_saved?: boolean | null
          name?: string
          notes?: string | null
          phone_number?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          last_message_at: string | null
          participant_1: string
          participant_2: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          participant_1: string
          participant_2: string
        }
        Update: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          participant_1?: string
          participant_2?: string
        }
        Relationships: []
      }
      loans: {
        Row: {
          approval_date: string | null
          approved_at: string | null
          approved_by: string | null
          created_at: string
          id: string
          interest_rate: number
          loan_number: string
          monthly_payment: number
          next_payment_date: string
          principal_amount: number
          rejection_reason: string | null
          remaining_balance: number
          status: string
          term_months: number
          updated_at: string
          user_id: string
        }
        Insert: {
          approval_date?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          interest_rate: number
          loan_number: string
          monthly_payment: number
          next_payment_date: string
          principal_amount: number
          rejection_reason?: string | null
          remaining_balance: number
          status?: string
          term_months: number
          updated_at?: string
          user_id: string
        }
        Update: {
          approval_date?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          interest_rate?: number
          loan_number?: string
          monthly_payment?: number
          next_payment_date?: string
          principal_amount?: number
          rejection_reason?: string | null
          remaining_balance?: number
          status?: string
          term_months?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      location_data: {
        Row: {
          accuracy: number
          address: string | null
          contact_name: string | null
          created_at: string | null
          id: string
          latitude: number
          longitude: number
          phone_number: string
          timestamp: string
          user_id: string | null
        }
        Insert: {
          accuracy: number
          address?: string | null
          contact_name?: string | null
          created_at?: string | null
          id?: string
          latitude: number
          longitude: number
          phone_number: string
          timestamp: string
          user_id?: string | null
        }
        Update: {
          accuracy?: number
          address?: string | null
          contact_name?: string | null
          created_at?: string | null
          id?: string
          latitude?: number
          longitude?: number
          phone_number?: string
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read_at: string | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read_at?: string | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read_at?: string | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      savings_accounts: {
        Row: {
          account_number: string
          balance: number
          created_at: string
          id: string
          interest_earned: number
          interest_rate: number
          is_active: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          account_number: string
          balance?: number
          created_at?: string
          id?: string
          interest_earned?: number
          interest_rate?: number
          is_active?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          account_number?: string
          balance?: number
          created_at?: string
          id?: string
          interest_earned?: number
          interest_rate?: number
          is_active?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tracked_numbers: {
        Row: {
          call_count: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          label: string
          last_seen: string | null
          phone_number: string
          text_count: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          call_count?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          label: string
          last_seen?: string | null
          phone_number: string
          text_count?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          call_count?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          label?: string
          last_seen?: string | null
          phone_number?: string
          text_count?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          account_id: string | null
          account_type: string
          amount: number
          balance_after: number
          created_at: string
          description: string | null
          id: string
          reference_number: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          account_id?: string | null
          account_type: string
          amount: number
          balance_after: number
          created_at?: string
          description?: string | null
          id?: string
          reference_number: string
          transaction_type: string
          user_id: string
        }
        Update: {
          account_id?: string | null
          account_type?: string
          amount?: number
          balance_after?: number
          created_at?: string
          description?: string | null
          id?: string
          reference_number?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          address: string | null
          created_at: string
          credit_score: number
          email: string
          full_name: string
          id: string
          is_verified: boolean
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          credit_score?: number
          email: string
          full_name: string
          id?: string
          is_verified?: boolean
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          credit_score?: number
          email?: string
          full_name?: string
          id?: string
          is_verified?: boolean
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
