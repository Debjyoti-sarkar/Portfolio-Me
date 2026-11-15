export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  portfolio: {
    Tables: {
      achievements: {
        Row: {
          created_at: string;
          date: string;
          date_precision: string;
          description: string | null;
          event: string;
          id: string;
          kind: string;
          project_slug: string | null;
          title: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          date: string;
          date_precision?: string;
          description?: string | null;
          event: string;
          id?: string;
          kind?: string;
          project_slug?: string | null;
          title: string;
        };
        Update: {
          created_at?: string;
          date?: string;
          date_precision?: string;
          description?: string | null;
          event?: string;
          id?: string;
          kind?: string;
          project_slug?: string | null;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "achievements_project_slug_fkey";
            columns: ["project_slug"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["slug"];
          },
        ];
      };
      admins: {
        Row: {
          created_at: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      analytics_events: {
        Row: {
          created_at: string;
          device: string | null;
          event: string;
          id: number;
          path: string;
          referrer_host: string | null;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          device?: string | null;
          event: string;
          id?: never;
          path: string;
          referrer_host?: string | null;
        };
        Update: {
          created_at?: string;
          device?: string | null;
          event?: string;
          id?: never;
          path?: string;
          referrer_host?: string | null;
        };
        Relationships: [];
      };
      blog_posts: {
        Row: {
          content: string;
          cover_image: string | null;
          created_at: string;
          excerpt: string;
          id: string;
          published: boolean;
          published_at: string | null;
          slug: string;
          tags: string[];
          title: string;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          content?: string;
          cover_image?: string | null;
          created_at?: string;
          excerpt?: string;
          id?: string;
          published?: boolean;
          published_at?: string | null;
          slug: string;
          tags?: string[];
          title: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          cover_image?: string | null;
          created_at?: string;
          excerpt?: string;
          id?: string;
          published?: boolean;
          published_at?: string | null;
          slug?: string;
          tags?: string[];
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          ip_hash: string;
          message: string;
          name: string;
          read: boolean;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          ip_hash: string;
          message: string;
          name: string;
          read?: boolean;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          ip_hash?: string;
          message?: string;
          name?: string;
          read?: boolean;
        };
        Relationships: [];
      };
      experiences: {
        Row: {
          created_at: string;
          end_date: string | null;
          highlights: string[];
          id: string;
          kind: string;
          location: string | null;
          organization: string;
          role: string;
          sort_order: number;
          start_date: string;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          end_date?: string | null;
          highlights?: string[];
          id?: string;
          kind: string;
          location?: string | null;
          organization: string;
          role: string;
          sort_order?: number;
          start_date: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          end_date?: string | null;
          highlights?: string[];
          id?: string;
          kind?: string;
          location?: string | null;
          organization?: string;
          role?: string;
          sort_order?: number;
          start_date?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          architecture: string | null;
          award: string | null;
          categories: string[];
          challenges: string | null;
          cover_image: string | null;
          created_at: string;
          credits: string | null;
          featured: boolean;
          gallery: NonNullable<Json>;
          github_url: string | null;
          id: string;
          live_url: string | null;
          period: string | null;
          problem: string | null;
          results: string | null;
          role: string | null;
          slug: string;
          social_impact: boolean;
          sort_order: number;
          status: string;
          summary: string;
          tagline: string;
          tech: string[];
          title: string;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          architecture?: string | null;
          award?: string | null;
          categories?: string[];
          challenges?: string | null;
          cover_image?: string | null;
          created_at?: string;
          credits?: string | null;
          featured?: boolean;
          gallery?: NonNullable<Json>;
          github_url?: string | null;
          id?: string;
          live_url?: string | null;
          period?: string | null;
          problem?: string | null;
          results?: string | null;
          role?: string | null;
          slug: string;
          social_impact?: boolean;
          sort_order?: number;
          status?: string;
          summary: string;
          tagline: string;
          tech?: string[];
          title: string;
          updated_at?: string;
        };
        Update: {
          architecture?: string | null;
          award?: string | null;
          categories?: string[];
          challenges?: string | null;
          cover_image?: string | null;
          created_at?: string;
          credits?: string | null;
          featured?: boolean;
          gallery?: NonNullable<Json>;
          github_url?: string | null;
          id?: string;
          live_url?: string | null;
          period?: string | null;
          problem?: string | null;
          results?: string | null;
          role?: string | null;
          slug?: string;
          social_impact?: boolean;
          sort_order?: number;
          status?: string;
          summary?: string;
          tagline?: string;
          tech?: string[];
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      skills: {
        Row: {
          created_at: string;
          group_name: string;
          group_order: number;
          id: string;
          name: string;
          sort_order: number;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          group_name: string;
          group_order?: number;
          id?: string;
          name: string;
          sort_order?: number;
        };
        Update: {
          created_at?: string;
          group_name?: string;
          group_order?: number;
          id?: string;
          name?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      analytics_summary: {
        Args: { days?: number };
        Returns: {
          event: string;
          path: string;
          total: number;
        }[];
      };
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]) | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  portfolio: {
    Enums: {},
  },
} as const;
