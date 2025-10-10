export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          created_by: string | null
          id: number
          name: string
          type: Database["public"]["Enums"]["category_type"]
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          name: string
          type?: Database["public"]["Enums"]["category_type"]
        }
        Update: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string
          type?: Database["public"]["Enums"]["category_type"]
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      facebook_posts: {
        Row: {
          content: string | null
          converted_time: string | null
          created_at: string
          id: number
          images: string | null
          is_hot_news: boolean
          page_name: string | null
          short_name: string | null
          time: string | null
          title: string | null
          type: Database["public"]["Enums"]["fb_post_type"] | null
          url: string | null
        }
        Insert: {
          content?: string | null
          converted_time?: string | null
          created_at?: string
          id?: number
          images?: string | null
          is_hot_news?: boolean
          page_name?: string | null
          short_name?: string | null
          time?: string | null
          title?: string | null
          type?: Database["public"]["Enums"]["fb_post_type"] | null
          url?: string | null
        }
        Update: {
          content?: string | null
          converted_time?: string | null
          created_at?: string
          id?: number
          images?: string | null
          is_hot_news?: boolean
          page_name?: string | null
          short_name?: string | null
          time?: string | null
          title?: string | null
          type?: Database["public"]["Enums"]["fb_post_type"] | null
          url?: string | null
        }
        Relationships: []
      }
      locations: {
        Row: {
          description: string | null
          id: number
          images: string[] | null
          lat: number
          lng: number
          name: string
        }
        Insert: {
          description?: string | null
          id?: number
          images?: string[] | null
          lat: number
          lng: number
          name: string
        }
        Update: {
          description?: string | null
          id?: number
          images?: string[] | null
          lat?: number
          lng?: number
          name?: string
        }
        Relationships: []
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      periods_in_day: {
        Row: {
          created_at: string | null
          created_by: string | null
          end_time: string
          id: number
          minutes: number
          modified_at: string | null
          modified_by: string | null
          period: number
          start_time: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          end_time: string
          id?: number
          minutes?: number
          modified_at?: string | null
          modified_by?: string | null
          period: number
          start_time: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          end_time?: string
          id?: number
          minutes?: number
          modified_at?: string | null
          modified_by?: string | null
          period?: number
          start_time?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          created_by: string | null
          file_path: Json | null
          id: string
          mime_type: string | null
          name: string
          size: number
          updated_at: string
          updated_by: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          file_path?: Json | null
          id?: string
          mime_type?: string | null
          name: string
          size: number
          updated_at?: string
          updated_by?: string | null
          workspace_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          file_path?: Json | null
          id?: string
          mime_type?: string | null
          name?: string
          size?: number
          updated_at?: string
          updated_by?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      rss_profiles: {
        Row: {
          avatar: string | null
          name: string | null
          short_name: string
          url: string | null
        }
        Insert: {
          avatar?: string | null
          name?: string | null
          short_name: string
          url?: string | null
        }
        Update: {
          avatar?: string | null
          name?: string | null
          short_name?: string
          url?: string | null
        }
        Relationships: []
      }
      semesters: {
        Row: {
          created_at: string
          created_by: string | null
          end_at: string
          id: number
          is_lecturer: boolean
          modified_at: string | null
          modified_by: string | null
          start_at: string
          title: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          end_at: string
          id: number
          is_lecturer?: boolean
          modified_at?: string | null
          modified_by?: string | null
          start_at: string
          title?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          end_at?: string
          id?: number
          is_lecturer?: boolean
          modified_at?: string | null
          modified_by?: string | null
          start_at?: string
          title?: string | null
        }
        Relationships: []
      }
      timetable: {
        Row: {
          class_code: string | null
          class_date: string
          class_name: string | null
          created_at: string
          created_by: string | null
          credits: string
          day_of_week: number
          group_code: string | null
          id: number
          is_previous_semester: number
          lecturer_code: string | null
          lecturer_name: string | null
          modified_at: string | null
          modified_by: string | null
          room_code: string | null
          start_period: number
          subject_code: string
          subject_name: string
          total_periods: number
          user_id: string
        }
        Insert: {
          class_code?: string | null
          class_date: string
          class_name?: string | null
          created_at?: string
          created_by?: string | null
          credits: string
          day_of_week: number
          group_code?: string | null
          id?: number
          is_previous_semester?: number
          lecturer_code?: string | null
          lecturer_name?: string | null
          modified_at?: string | null
          modified_by?: string | null
          room_code?: string | null
          start_period: number
          subject_code: string
          subject_name: string
          total_periods: number
          user_id: string
        }
        Update: {
          class_code?: string | null
          class_date?: string
          class_name?: string | null
          created_at?: string
          created_by?: string | null
          credits?: string
          day_of_week?: number
          group_code?: string | null
          id?: number
          is_previous_semester?: number
          lecturer_code?: string | null
          lecturer_name?: string | null
          modified_at?: string | null
          modified_by?: string | null
          room_code?: string | null
          start_period?: number
          subject_code?: string
          subject_name?: string
          total_periods?: number
          user_id?: string
        }
        Relationships: []
      }
      timetable_weeks: {
        Row: {
          absolute_week: number
          created_at: string
          created_by: string | null
          end_date: string
          id: number
          modified_at: string | null
          modified_by: string | null
          semester_id: number
          start_date: string
          title: string
          week_semester: number
        }
        Insert: {
          absolute_week: number
          created_at?: string
          created_by?: string | null
          end_date: string
          id?: number
          modified_at?: string | null
          modified_by?: string | null
          semester_id: number
          start_date: string
          title: string
          week_semester: number
        }
        Update: {
          absolute_week?: number
          created_at?: string
          created_by?: string | null
          end_date?: string
          id?: number
          modified_at?: string | null
          modified_by?: string | null
          semester_id?: number
          start_date?: string
          title?: string
          week_semester?: number
        }
        Relationships: [
          {
            foreignKeyName: "timetable_weeks_semester_id_fkey"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "semesters"
            referencedColumns: ["id"]
          },
        ]
      }
      user_events: {
        Row: {
          category: number | null
          created_at: string
          end_date: string
          id: number
          notes: string
          start_date: string
          title: string
          user_uuid: string
        }
        Insert: {
          category?: number | null
          created_at?: string
          end_date: string
          id?: number
          notes?: string
          start_date: string
          title?: string
          user_uuid?: string
        }
        Update: {
          category?: number | null
          created_at?: string
          end_date?: string
          id?: number
          notes?: string
          start_date?: string
          title?: string
          user_uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_events_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          email: string
          id: string
          name: string
        }
        Insert: {
          email: string
          id: string
          name: string
        }
        Update: {
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      variables: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          name: string
          order_index: number | null
          project_id: string
          type: string
          updated_at: string | null
          updated_by: string | null
          value: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
          order_index?: number | null
          project_id: string
          type: string
          updated_at?: string | null
          updated_by?: string | null
          value?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
          order_index?: number | null
          project_id?: string
          type?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "variables_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      match_documents: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      category_type: "global" | "user"
      doc_category: "default" | "văn bản"
      fb_post_type: "training_point" | "event" | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      category_type: ["global", "user"],
      doc_category: ["default", "văn bản"],
      fb_post_type: ["training_point", "event", "other"],
    },
  },
} as const
