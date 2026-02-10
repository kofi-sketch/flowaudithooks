'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveHook(hookId: string) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to save hooks' }
  }

  // Check if already saved
  const { data: existing } = await supabase
    .from('saved_hooks')
    .select('id')
    .eq('user_id', user.id)
    .eq('hook_id', hookId)
    .single()

  if (existing) {
    return { error: 'Hook already saved' }
  }

  // Save the hook
  const { error } = await supabase
    .from('saved_hooks')
    .insert({
      user_id: user.id,
      hook_id: hookId,
    })

  if (error) {
    console.error('Error saving hook:', error)
    return { error: 'Failed to save hook' }
  }

  revalidatePath('/test')
  revalidatePath('/admin')
  return { success: true }
}

export async function unsaveHook(hookId: string) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to unsave hooks' }
  }

  // Delete the saved hook
  const { error } = await supabase
    .from('saved_hooks')
    .delete()
    .eq('user_id', user.id)
    .eq('hook_id', hookId)

  if (error) {
    console.error('Error unsaving hook:', error)
    return { error: 'Failed to unsave hook' }
  }

  revalidatePath('/test')
  revalidatePath('/admin')
  return { success: true }
}

export async function getSavedHooks() {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: 'You must be logged in to view saved hooks' }
  }

  // Get saved hooks with full hook data
  const { data, error } = await supabase
    .from('saved_hooks')
    .select(`
      id,
      created_at,
      hook_id,
      hooks:hook_id (
        id,
        text,
        total_votes,
        green_votes,
        red_votes,
        green_percentage,
        is_flagged,
        created_at
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching saved hooks:', error)
    return { data: null, error: 'Failed to fetch saved hooks' }
  }

  return { data, error: null }
}

export async function isSaved(hookId: string) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { isSaved: false }
  }

  const { data } = await supabase
    .from('saved_hooks')
    .select('id')
    .eq('user_id', user.id)
    .eq('hook_id', hookId)
    .single()

  return { isSaved: !!data }
}

// Admin function to get all saved hooks across all users
export async function getAllSavedHooks() {
  const supabase = await createClient()

  // Get current user and check if admin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: 'You must be logged in' }
  }

  const { data: userData } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!userData?.is_admin) {
    return { data: null, error: 'Unauthorized' }
  }

  // Get all saved hooks with user and hook data
  const { data, error } = await supabase
    .from('saved_hooks')
    .select(`
      id,
      created_at,
      user_id,
      hook_id,
      users:user_id (
        email
      ),
      hooks:hook_id (
        id,
        text,
        total_votes,
        green_votes,
        red_votes,
        green_percentage,
        is_flagged,
        created_at
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all saved hooks:', error)
    return { data: null, error: 'Failed to fetch saved hooks' }
  }

  return { data, error: null }
}
