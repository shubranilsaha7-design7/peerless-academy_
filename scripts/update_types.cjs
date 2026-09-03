const fs = require('fs');

let types = fs.readFileSync('src/integrations/supabase/types.ts', 'utf8');

const additionalTables = `
      arena_rooms: {
        Row: {
          id: string
          room_code: string
          host_user_id: string
          status: 'waiting' | 'in_progress' | 'completed'
          settings_json: any
          created_at: string
        }
        Insert: {
          id?: string
          room_code: string
          host_user_id: string
          status?: 'waiting' | 'in_progress' | 'completed'
          settings_json?: any
          created_at?: string
        }
        Update: {
          id?: string
          room_code?: string
          host_user_id?: string
          status?: 'waiting' | 'in_progress' | 'completed'
          settings_json?: any
          created_at?: string
        }
      }
      arena_participants: {
        Row: {
          room_id: string
          user_id: string
          user_name: string
          avatar: string
          score: number
          is_ready: boolean
          completed_at: string | null
        }
        Insert: {
          room_id: string
          user_id: string
          user_name: string
          avatar: string
          score?: number
          is_ready?: boolean
          completed_at?: string | null
        }
        Update: {
          room_id?: string
          user_id?: string
          user_name?: string
          avatar?: string
          score?: number
          is_ready?: boolean
          completed_at?: string | null
        }
      }
`;

types = types.replace('export interface Database {\n  public: {\n    Tables: {', 'export interface Database {\n  public: {\n    Tables: {' + additionalTables);
fs.writeFileSync('src/integrations/supabase/types.ts', types);
console.log('Types updated');
