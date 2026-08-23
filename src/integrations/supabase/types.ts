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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      arena_matches: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          is_ai_match: boolean | null
          player1_id: string | null
          player1_score: number | null
          player2_id: string | null
          player2_score: number | null
          question_ids: Json | null
          round_results: Json | null
          status: string | null
          winner_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          is_ai_match?: boolean | null
          player1_id?: string | null
          player1_score?: number | null
          player2_id?: string | null
          player2_score?: number | null
          question_ids?: Json | null
          round_results?: Json | null
          status?: string | null
          winner_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          is_ai_match?: boolean | null
          player1_id?: string | null
          player1_score?: number | null
          player2_id?: string | null
          player2_score?: number | null
          question_ids?: Json | null
          round_results?: Json | null
          status?: string | null
          winner_id?: string | null
        }
        Relationships: []
      }
      attendance: {
        Row: {
          batch: string | null
          created_at: string
          id: string
          note: string | null
          session_date: string
          status: string
          user_id: string
        }
        Insert: {
          batch?: string | null
          created_at?: string
          id?: string
          note?: string | null
          session_date?: string
          status?: string
          user_id: string
        }
        Update: {
          batch?: string | null
          created_at?: string
          id?: string
          note?: string | null
          session_date?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      contact_inquiries: {
        Row: {
          class_level: string
          created_at: string | null
          guardian_name: string
          id: string
          message: string | null
          phone: string
          student_name: string
        }
        Insert: {
          class_level: string
          created_at?: string | null
          guardian_name: string
          id?: string
          message?: string | null
          phone: string
          student_name: string
        }
        Update: {
          class_level?: string
          created_at?: string | null
          guardian_name?: string
          id?: string
          message?: string | null
          phone?: string
          student_name?: string
        }
        Relationships: []
      }
      dpp_questions: {
        Row: {
          answer_index: number
          class_level: number
          created_at: string
          difficulty: string
          id: string
          options: Json
          question: string
          solution: string | null
          subject: string
          topic: string | null
        }
        Insert: {
          answer_index?: number
          class_level: number
          created_at?: string
          difficulty?: string
          id?: string
          options?: Json
          question: string
          solution?: string | null
          subject: string
          topic?: string | null
        }
        Update: {
          answer_index?: number
          class_level?: number
          created_at?: string
          difficulty?: string
          id?: string
          options?: Json
          question?: string
          solution?: string | null
          subject?: string
          topic?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          class_level: number | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          streak: number
          updated_at: string
          xp: number
        }
        Insert: {
          class_level?: number | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          streak?: number
          updated_at?: string
          xp?: number
        }
        Update: {
          class_level?: number | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          streak?: number
          updated_at?: string
          xp?: number
        }
        Relationships: []
      }
      test_submissions: {
        Row: {
          correct: number
          created_at: string
          details: Json
          exam_type: string
          id: string
          score: number
          skipped: number
          time_spent_seconds: number
          total: number
          user_id: string
          wrong: number
        }
        Insert: {
          correct?: number
          created_at?: string
          details?: Json
          exam_type?: string
          id?: string
          score?: number
          skipped?: number
          time_spent_seconds?: number
          total?: number
          user_id: string
          wrong?: number
        }
        Update: {
          correct?: number
          created_at?: string
          details?: Json
          exam_type?: string
          id?: string
          score?: number
          skipped?: number
          time_spent_seconds?: number
          total?: number
          user_id?: string
          wrong?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      video_lectures: {
        Row: {
          chapter: string
          created_at: string | null
          duration: number | null
          id: string
          subject: string
          title: string
          video_url: string
        }
        Insert: {
          chapter: string
          created_at?: string | null
          duration?: number | null
          id?: string
          subject: string
          title: string
          video_url: string
        }
        Update: {
          chapter?: string
          created_at?: string | null
          duration?: number | null
          id?: string
          subject?: string
          title?: string
          video_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "teacher" | "student"
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
      app_role: ["admin", "teacher", "student"],
    },
  },
} as const
