import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://czkcpnuthjufkdeldnoe.supabase.co";
const supabaseKey = "sb_publishable_on8BZ-PU4idUMHOaGJo_ZA_A_C2LJz9";

export const supabase = createClient(supabaseUrl, supabaseKey);