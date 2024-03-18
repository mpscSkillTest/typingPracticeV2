import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config();

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.SUPABASE_DB_URL,
  process.env.SUPABASE_DB_KEY
);
