#!/usr/bin/env node

/**
 * Script to run database migrations
 * Usage: node scripts/run-migration.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') })

async function runMigration() {
  // You'll need to add SUPABASE_SERVICE_ROLE_KEY to your .env.local
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing required environment variables:')
    console.error('   - NEXT_PUBLIC_SUPABASE_URL')
    console.error('   - SUPABASE_SERVICE_ROLE_KEY')
    console.error('\nAdd SUPABASE_SERVICE_ROLE_KEY to your .env.local file.')
    console.error('You can find it in: Supabase Dashboard → Settings → API → service_role key')
    process.exit(1)
  }

  // Create Supabase client with service role key (has admin privileges)
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  // Read the migration file
  const migrationPath = path.join(__dirname, '../supabase/migrations/006_add_saved_hooks_content_type.sql')
  const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

  console.log('🚀 Running migration: 006_add_saved_hooks_content_type.sql\n')

  try {
    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL })

    if (error) {
      // If rpc doesn't work, try direct query
      const { error: queryError } = await supabase.from('_temp').select('*').limit(0)

      // Since we can't use rpc, we'll use the SQL directly
      console.log('⚠️  Could not use RPC method. Please run the migration manually.')
      console.log('\nCopy and paste this SQL into Supabase SQL Editor:\n')
      console.log('─'.repeat(80))
      console.log(migrationSQL)
      console.log('─'.repeat(80))
      console.log('\nGo to: https://supabase.com/dashboard → Your Project → SQL Editor')
      process.exit(1)
    }

    console.log('✅ Migration completed successfully!')
    console.log('\nChanges made:')
    console.log('  • Added content_type column to saved_hooks table')
    console.log('  • Populated existing records with content_type')
    console.log('  • Made content_type column required')
    console.log('  • Added index for efficient filtering')

  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    console.log('\n📋 Please run this migration manually in Supabase SQL Editor:')
    console.log('─'.repeat(80))
    console.log(migrationSQL)
    console.log('─'.repeat(80))
    console.log('\nGo to: https://supabase.com/dashboard → Your Project → SQL Editor')
    process.exit(1)
  }
}

runMigration()
