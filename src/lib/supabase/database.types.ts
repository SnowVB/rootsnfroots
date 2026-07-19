// Hand-written to match supabase/migrations/0001_init.sql.
// If the schema changes, update this file in the same commit as the migration.
//
// Relationships/Views/Functions are required (even empty) by @supabase/postgrest-js's
// GenericSchema constraint — omitting them collapses every table's row type to `never`.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          tier: "free" | "premium";
          subscription_status: "active" | "past_due" | "canceled" | null;
          language: "ru" | "en";
          created_at: string;
          last_active_at: string;
        };
        Insert: {
          id: string;
          tier?: "free" | "premium";
          subscription_status?: "active" | "past_due" | "canceled" | null;
          language?: "ru" | "en";
          created_at?: string;
          last_active_at?: string;
        };
        Update: {
          id?: string;
          tier?: "free" | "premium";
          subscription_status?: "active" | "past_due" | "canceled" | null;
          language?: "ru" | "en";
          created_at?: string;
          last_active_at?: string;
        };
        Relationships: [];
      };
      trees: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          horizon: "6m" | "1y" | "3y" | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name?: string;
          horizon?: "6m" | "1y" | "3y" | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          horizon?: "6m" | "1y" | "3y" | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      roots: {
        Row: {
          id: string;
          tree_id: string;
          text: string;
          slot_id: string | null;
          x: number | null;
          y: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tree_id: string;
          text: string;
          slot_id?: string | null;
          x?: number | null;
          y?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tree_id?: string;
          text?: string;
          slot_id?: string | null;
          x?: number | null;
          y?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      trunk_items: {
        Row: {
          id: string;
          tree_id: string;
          text: string;
          x: number | null;
          y: number | null;
          pinned: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tree_id: string;
          text: string;
          x?: number | null;
          y?: number | null;
          pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tree_id?: string;
          text?: string;
          x?: number | null;
          y?: number | null;
          pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      branches: {
        Row: {
          id: string;
          tree_id: string;
          text: string;
          slot_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tree_id: string;
          text: string;
          slot_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tree_id?: string;
          text?: string;
          slot_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      fruits: {
        Row: {
          id: string;
          tree_id: string;
          branch_id: string | null;
          text: string;
          x: number;
          y: number;
          harvested: boolean;
          harvested_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tree_id: string;
          branch_id?: string | null;
          text: string;
          x: number;
          y: number;
          harvested?: boolean;
          harvested_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tree_id?: string;
          branch_id?: string | null;
          text?: string;
          x?: number;
          y?: number;
          harvested?: boolean;
          harvested_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
