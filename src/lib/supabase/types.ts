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
      cash_register: {
        Row: {
          added_by: string | null
          amount: number
          bank_name: string | null
          created_at: string | null
          date: string | null
          from: string | null
          id: string
          shop_id: string
          type: Database["public"]["Enums"]["transaction_type"]
        }
        Insert: {
          added_by?: string | null
          amount: number
          bank_name?: string | null
          created_at?: string | null
          date?: string | null
          from?: string | null
          id?: string
          shop_id: string
          type: Database["public"]["Enums"]["transaction_type"]
        }
        Update: {
          added_by?: string | null
          amount?: number
          bank_name?: string | null
          created_at?: string | null
          date?: string | null
          from?: string | null
          id?: string
          shop_id?: string
          type?: Database["public"]["Enums"]["transaction_type"]
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          deleted_at: string | null
          id: string
          image: string | null
          reply_to: string | null
          shop_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          image?: string | null
          reply_to?: string | null
          shop_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          image?: string | null
          reply_to?: string | null
          shop_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_reply_to_fkey"
            columns: ["reply_to"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_reports: {
        Row: {
          chat_message_id: string
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          chat_message_id: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          chat_message_id?: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_reports_chat_message_id_fkey"
            columns: ["chat_message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          external_id: string
          id: string
          region: string | null
          title: string
        }
        Insert: {
          external_id: string
          id?: string
          region?: string | null
          title: string
        }
        Update: {
          external_id?: string
          id?: string
          region?: string | null
          title?: string
        }
        Relationships: []
      }
      contractors: {
        Row: {
          address: string | null
          contract: string | null
          created_at: string | null
          id: string
          note: string | null
          sales_representative: string | null
          sales_representative_phone: string | null
          shop_id: string | null
          supervisor: string | null
          supervisor_phone: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          contract?: string | null
          created_at?: string | null
          id?: string
          note?: string | null
          sales_representative?: string | null
          sales_representative_phone?: string | null
          shop_id?: string | null
          supervisor?: string | null
          supervisor_phone?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          contract?: string | null
          created_at?: string | null
          id?: string
          note?: string | null
          sales_representative?: string | null
          sales_representative_phone?: string | null
          shop_id?: string | null
          supervisor?: string | null
          supervisor_phone?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contractors_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      debtor_transactions: {
        Row: {
          added_by: string | null
          amount: number
          created_at: string | null
          debtor_id: string | null
          description: string | null
          id: string
          transaction_date: string | null
          transaction_type: string
        }
        Insert: {
          added_by?: string | null
          amount: number
          created_at?: string | null
          debtor_id?: string | null
          description?: string | null
          id?: string
          transaction_date?: string | null
          transaction_type: string
        }
        Update: {
          added_by?: string | null
          amount?: number
          created_at?: string | null
          debtor_id?: string | null
          description?: string | null
          id?: string
          transaction_date?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "debtor_transactions_debtor_id_fkey"
            columns: ["debtor_id"]
            isOneToOne: false
            referencedRelation: "debtors"
            referencedColumns: ["id"]
          },
        ]
      }
      debtors: {
        Row: {
          additional_info: string | null
          address: string | null
          balance: number
          blacklist: boolean | null
          created_at: string | null
          full_name: string
          id: string
          iin: string
          is_overdue: boolean
          max_credit_amount: number
          phone: string | null
          shop_id: string
          updated_at: string | null
          work_place: string | null
        }
        Insert: {
          additional_info?: string | null
          address?: string | null
          balance?: number
          blacklist?: boolean | null
          created_at?: string | null
          full_name: string
          id?: string
          iin: string
          is_overdue?: boolean
          max_credit_amount: number
          phone?: string | null
          shop_id: string
          updated_at?: string | null
          work_place?: string | null
        }
        Update: {
          additional_info?: string | null
          address?: string | null
          balance?: number
          blacklist?: boolean | null
          created_at?: string | null
          full_name?: string
          id?: string
          iin?: string
          is_overdue?: boolean
          max_credit_amount?: number
          phone?: string | null
          shop_id?: string
          updated_at?: string | null
          work_place?: string | null
        }
        Relationships: []
      }
      deliveries: {
        Row: {
          accepted_date: string | null
          amount_expected: number
          amount_received: number | null
          consignment_due_date: string | null
          consignment_status: string | null
          contractor_id: string
          created_at: string | null
          expected_date: string
          id: string
          is_consignement: boolean
          shop_id: string
          status: Database["public"]["Enums"]["delivery_status"]
          updated_at: string | null
        }
        Insert: {
          accepted_date?: string | null
          amount_expected: number
          amount_received?: number | null
          consignment_due_date?: string | null
          consignment_status?: string | null
          contractor_id: string
          created_at?: string | null
          expected_date: string
          id?: string
          is_consignement?: boolean
          shop_id: string
          status?: Database["public"]["Enums"]["delivery_status"]
          updated_at?: string | null
        }
        Update: {
          accepted_date?: string | null
          amount_expected?: number
          amount_received?: number | null
          consignment_due_date?: string | null
          consignment_status?: string | null
          contractor_id?: string
          created_at?: string | null
          expected_date?: string
          id?: string
          is_consignement?: boolean
          shop_id?: string
          status?: Database["public"]["Enums"]["delivery_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deliveries_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_sessions: {
        Row: {
          admin_id: string
          auth_id: string
          created_at: string | null
          employee_id: string
          expires_at: string
          id: string
          session_token: string
          shop_id: string
        }
        Insert: {
          admin_id: string
          auth_id: string
          created_at?: string | null
          employee_id: string
          expires_at: string
          id?: string
          session_token: string
          shop_id: string
        }
        Update: {
          admin_id?: string
          auth_id?: string
          created_at?: string | null
          employee_id?: string
          expires_at?: string
          id?: string
          session_token?: string
          shop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_sessions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_sessions_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          created_at: string | null
          full_name: string
          id: string
          pin_code: string
          shop_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name: string
          id?: string
          pin_code: string
          shop_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string
          id?: string
          pin_code?: string
          shop_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          created_at: string | null
          date: string
          id: string
          shop_id: string
          type: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          date?: string
          id?: string
          shop_id: string
          type: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          date?: string
          id?: string
          shop_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      file_references: {
        Row: {
          created_at: string | null
          entity: string
          entity_type: string
          file_path: string
          id: string
          shop_id: string
          upload_id: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          entity: string
          entity_type: string
          file_path: string
          id?: string
          shop_id: string
          upload_id?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          entity?: string
          entity_type?: string
          file_path?: string
          id?: string
          shop_id?: string
          upload_id?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "file_references_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "file_references_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "extended_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "file_references_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          content: string
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content?: string
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          language: string | null
          pin_code: string | null
          role_id: number | null
          shop_id: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          language?: string | null
          pin_code?: string | null
          role_id?: number | null
          shop_id?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          language?: string | null
          pin_code?: string | null
          role_id?: number | null
          shop_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          id: number
          role: string | null
          scope: string[] | null
        }
        Insert: {
          created_at?: string
          id?: number
          role?: string | null
          scope?: string[] | null
        }
        Update: {
          created_at?: string
          id?: number
          role?: string | null
          scope?: string[] | null
        }
        Relationships: []
      }
      shop_statistics: {
        Row: {
          id: string
          last_updated: string | null
          overdue_debtors: number
          shop_id: string
          total_debt: number
          total_payments: number
        }
        Insert: {
          id?: string
          last_updated?: string | null
          overdue_debtors?: number
          shop_id: string
          total_debt?: number
          total_payments?: number
        }
        Update: {
          id?: string
          last_updated?: string | null
          overdue_debtors?: number
          shop_id?: string
          total_debt?: number
          total_payments?: number
        }
        Relationships: []
      }
      shops: {
        Row: {
          address: string
          city: string
          id: string
          title: string
        }
        Insert: {
          address?: string
          city?: string
          id?: string
          title: string
        }
        Update: {
          address?: string
          city?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      subscription_payments: {
        Row: {
          amount: number
          available_until: string | null
          created_at: string | null
          date: string
          id: string
          note: string | null
          payment_method: string
          shop_id: string
          started_from: string | null
          transaction_id: string
        }
        Insert: {
          amount: number
          available_until?: string | null
          created_at?: string | null
          date?: string
          id?: string
          note?: string | null
          payment_method: string
          shop_id: string
          started_from?: string | null
          transaction_id: string
        }
        Update: {
          amount?: number
          available_until?: string | null
          created_at?: string | null
          date?: string
          id?: string
          note?: string | null
          payment_method?: string
          shop_id?: string
          started_from?: string | null
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_payments_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      user_action_logs: {
        Row: {
          action: string
          details: Json | null
          employee_id: string | null
          entity: string
          entity_id: string | null
          id: number
          timestamp: string
          user_id: string | null
        }
        Insert: {
          action: string
          details?: Json | null
          employee_id?: string | null
          entity: string
          entity_id?: string | null
          id?: number
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          details?: Json | null
          employee_id?: string | null
          entity?: string
          entity_id?: string | null
          id?: number
          timestamp?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_action_logs_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      bank_names_view: {
        Row: {
          bank_name: string | null
        }
        Relationships: []
      }
      cash_register_ui_view: {
        Row: {
          bank_total: number | null
          banks: Json | null
          cash_total: number | null
          shop_id: string | null
          total_amount: number | null
        }
        Relationships: []
      }
      debtor_statistics: {
        Row: {
          overdue_debtors: number | null
          shop_id: string | null
          total_negative_balance: number | null
          total_positive_balance: number | null
        }
        Relationships: []
      }
      extended_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string | null
          language: string | null
          phone: string | null
          role_id: number | null
          shop_id: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      clean_old_logs: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      current_shop_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      distinct_expense_types: {
        Args: Record<PropertyKey, never>
        Returns: {
          type: string
        }[]
      }
      mark_overdue_deliveries: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      recalculate_is_overdue: {
        Args: { debtor_id: string }
        Returns: undefined
      }
      update_debtor_balance: {
        Args: { debtor_id: string; new_balance: number }
        Returns: undefined
      }
      update_payment_and_subscription: {
        Args: {
          shop_uuid: string
          amount: number
          payment_method: string
          transaction_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      delivery_status: "pending" | "accepted" | "due" | "canceled"
      transaction_type: "cash" | "bank_transfer"
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
    Enums: {
      delivery_status: ["pending", "accepted", "due", "canceled"],
      transaction_type: ["cash", "bank_transfer"],
    },
  },
} as const

