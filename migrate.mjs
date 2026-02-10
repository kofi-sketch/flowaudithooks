#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const SUPABASE_URL = 'https://stboueshyjvooiftfuxm.supabase.co'

// Read migration SQL
const migrationSQL = readFileSync('./supabase/migrations/006_add_saved_hooks_content_type.sql', 'utf8')

console.log('🔐 Please enter your Supabase Service Role Key')
console.log('   (Find it at: Supabase Dashboard → Settings → API → service_role secret)\n')

// Get service role key from command line argument
const serviceRoleKey = process.argv[2]

if (!serviceRoleKey) {
  console.error('❌ Error: Service role key required\n')
  console.log('Usage: node migrate.mjs YOUR_SERVICE_ROLE_KEY\n')
  console.log('Or follow the instructions in RUN_MIGRATION.md to use the Supabase Dashboard')
  process.exit(1)
}

console.log('🚀 Connecting to Supabase...\n')

const supabase = createClient(SUPABASE_URL, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

console.log('📝 Running migration: 006_add_saved_hooks_content_type.sql\n')

try {
  // Split into individual statements and run them
  const statements = migrationSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i] + ';'
    console.log(`   Executing statement ${i + 1}/${statements.length}...`)

    const { error } = await supabase.rpc('exec_sql', { sql: stmt }).catch(() => ({ error: 'RPC not available' }))

    if (error) {
      throw new Error(`Statement ${i + 1} failed. Please use Supabase SQL Editor instead.`)
    }
  }

  console.log('\n✅ Migration completed successfully!\n')
  console.log('Changes applied:')
  console.log('  • Added content_type column to saved_hooks')
  console.log('  • Populated existing records')
  console.log('  • Added NOT NULL constraint')
  console.log('  • Created index for filtering\n')

} catch (error) {
  console.error('\n❌ Migration failed:', error.message)
  console.log('\n📋 Please run the migration manually using the Supabase Dashboard:')
  console.log('   See RUN_MIGRATION.md for instructions\n')
  process.exit(1)
}
