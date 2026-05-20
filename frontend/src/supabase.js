import { createClient } from '@supabase/supabase-js'

// 1. La URL de tu proyecto (tomada de tu primera captura)
const supabaseUrl = 'https://czkcpnuthjufkdeldnoe.supabase.co'

// 2. Tu llave pública (Asegúrate de usar el botón "Copy" de tu tercera captura para pegarla completa)
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6a2NwbnV0aGp1ZmtkZWxkbm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMzg3NTgsImV4cCI6MjA5NDgxNDc1OH0.R0B6s8lVAEfKULzBVCS8KTqKwRh5_uV4A6xwhdDtleA'

// 3. Creamos la conexión oficial
export const supabase = createClient(supabaseUrl, supabaseKey)