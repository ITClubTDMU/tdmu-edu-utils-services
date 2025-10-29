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
  edudoc: {
    Tables: {
      badges: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          tier: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          tier?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          tier?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          document_id: string | null
          id: string
          parent_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          document_id?: string | null
          id?: string
          parent_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          document_id?: string | null
          id?: string
          parent_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      comments_votes: {
        Row: {
          comment_id: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string | null
          vote_type: number
        }
        Insert: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
          vote_type: number
        }
        Update: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
          vote_type?: number
        }
        Relationships: [
          {
            foreignKeyName: "comments_votes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      document_downloads: {
        Row: {
          document_id: string
          download_at: string | null
          id: number
          user_id: string | null
        }
        Insert: {
          document_id: string
          download_at?: string | null
          id?: number
          user_id?: string | null
        }
        Update: {
          document_id?: string
          download_at?: string | null
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_downloads_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_tags: {
        Row: {
          document_id: string | null
          id: string
          tag_id: string | null
        }
        Insert: {
          document_id?: string | null
          id?: string
          tag_id?: string | null
        }
        Update: {
          document_id?: string | null
          id?: string
          tag_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_tags_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      document_views: {
        Row: {
          document_id: string
          id: number
          user_id: string | null
          viewed_at: string | null
        }
        Insert: {
          document_id: string
          id?: number
          user_id?: string | null
          viewed_at?: string | null
        }
        Update: {
          document_id?: string
          id?: number
          user_id?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_views_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          description: string | null
          file_size: number
          file_type: string | null
          file_url: string
          folder_id: string | null
          id: string
          in_trash: boolean | null
          is_public: boolean | null
          name: string
          summary: string | null
          tags: string | null
          updated_at: string | null
          uploaded_by: string
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          file_size: number
          file_type?: string | null
          file_url: string
          folder_id?: string | null
          id?: string
          in_trash?: boolean | null
          is_public?: boolean | null
          name: string
          summary?: string | null
          tags?: string | null
          updated_at?: string | null
          uploaded_by: string
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          file_size?: number
          file_type?: string | null
          file_url?: string
          folder_id?: string | null
          id?: string
          in_trash?: boolean | null
          is_public?: boolean | null
          name?: string
          summary?: string | null
          tags?: string | null
          updated_at?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
        ]
      }
      documents_votes: {
        Row: {
          created_at: string | null
          document_id: string
          id: string
          updated_at: string | null
          user_id: string
          vote_type: number
        }
        Insert: {
          created_at?: string | null
          document_id: string
          id?: string
          updated_at?: string | null
          user_id: string
          vote_type: number
        }
        Update: {
          created_at?: string | null
          document_id?: string
          id?: string
          updated_at?: string | null
          user_id?: string
          vote_type?: number
        }
        Relationships: [
          {
            foreignKeyName: "documents_votes_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number
          created_at: string | null
          document_id: string | null
          from_user: string | null
          id: string
          message: string | null
          to_user: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          document_id?: string | null
          from_user?: string | null
          id?: string
          message?: string | null
          to_user?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          document_id?: string | null
          from_user?: string | null
          id?: string
          message?: string | null
          to_user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      folders: {
        Row: {
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          id: string
          in_trash: boolean | null
          name: string
          parent_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          in_trash?: boolean | null
          name: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          in_trash?: boolean | null
          name?: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "folders_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          count: number | null
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          count?: number | null
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          count?: number | null
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string | null
          earned_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          badge_id?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          badge_id?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
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
      workflow_conditions: {
        Row: {
          compare_value: string
          created_at: string | null
          description: string | null
          field_name: string
          id: string
          logic: string
          step_number: number
          workflow_id: string
        }
        Insert: {
          compare_value: string
          created_at?: string | null
          description?: string | null
          field_name: string
          id?: string
          logic: string
          step_number: number
          workflow_id: string
        }
        Update: {
          compare_value?: string
          created_at?: string | null
          description?: string | null
          field_name?: string
          id?: string
          logic?: string
          step_number?: number
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_conditions_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflow_info"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_info: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          step_count: number
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          step_count?: number
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          step_count?: number
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      workflow_instance_history: {
        Row: {
          action: string
          action_by: string | null
          actor_role: string
          comment: string | null
          created_at: string | null
          id: string
          instance_id: string
          step_number: number
        }
        Insert: {
          action: string
          action_by?: string | null
          actor_role: string
          comment?: string | null
          created_at?: string | null
          id?: string
          instance_id: string
          step_number: number
        }
        Update: {
          action?: string
          action_by?: string | null
          actor_role?: string
          comment?: string | null
          created_at?: string | null
          id?: string
          instance_id?: string
          step_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "workflow_instance_history_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "workflow_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_instances: {
        Row: {
          created_at: string | null
          current_step: number
          form_data: Json | null
          id: string
          status: Database["public"]["Enums"]["workflow_status"] | null
          updated_at: string | null
          user_id: string
          workflow_id: string
        }
        Insert: {
          created_at?: string | null
          current_step?: number
          form_data?: Json | null
          id?: string
          status?: Database["public"]["Enums"]["workflow_status"] | null
          updated_at?: string | null
          user_id: string
          workflow_id: string
        }
        Update: {
          created_at?: string | null
          current_step?: number
          form_data?: Json | null
          id?: string
          status?: Database["public"]["Enums"]["workflow_status"] | null
          updated_at?: string | null
          user_id?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_instances_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_instances_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflow_info"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_steps: {
        Row: {
          actions: Json | null
          created_at: string | null
          description: string | null
          handler_ref: string | null
          handler_type: string | null
          id: string
          is_end: boolean | null
          status: Database["public"]["Enums"]["workflow_status"] | null
          step_number: number
          type: string
          workflow_id: string
        }
        Insert: {
          actions?: Json | null
          created_at?: string | null
          description?: string | null
          handler_ref?: string | null
          handler_type?: string | null
          id?: string
          is_end?: boolean | null
          status?: Database["public"]["Enums"]["workflow_status"] | null
          step_number: number
          type: string
          workflow_id: string
        }
        Update: {
          actions?: Json | null
          created_at?: string | null
          description?: string | null
          handler_ref?: string | null
          handler_type?: string | null
          id?: string
          is_end?: boolean | null
          status?: Database["public"]["Enums"]["workflow_status"] | null
          step_number?: number
          type?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_steps_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflow_info"
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
      match_documents: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
    }
    Enums: {
      category_type: "global" | "user"
      doc_category: "default" | "văn bản"
      fb_post_type: "training_point" | "event" | "other"
      workflow_handler_type: "AUTHOR" | "GROUP" | "USER" | "CHOOSE_USER"
      workflow_status:
        | "receive"
        | "create"
        | "complete"
        | "aligning"
        | "wait_receive"
        | "in_progress"
        | "reject"
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
  edudoc: {
    Enums: {},
  },
  public: {
    Enums: {
      category_type: ["global", "user"],
      doc_category: ["default", "văn bản"],
      fb_post_type: ["training_point", "event", "other"],
      workflow_handler_type: ["AUTHOR", "GROUP", "USER", "CHOOSE_USER"],
      workflow_status: [
        "receive",
        "create",
        "complete",
        "aligning",
        "wait_receive",
        "in_progress",
        "reject",
      ],
    },
  },
} as const
