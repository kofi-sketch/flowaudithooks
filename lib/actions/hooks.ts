'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Hook } from '@/lib/types/database'

export async function getRandomHook(excludedIds: string[] = []): Promise<Hook | null> {
  const supabase = await createClient()

  // Call the database function to get a random hook
  const { data, error } = await supabase
    .rpc('get_random_hook', { excluded_ids: excludedIds })

  if (error) {
    console.error('Error fetching random hook:', error)
    return null
  }

  if (!data || data.length === 0) {
    // If no hooks available (or all excluded), try fetching any hook
    const { data: anyHook, error: anyError } = await supabase
      .from('hooks')
      .select('*')
      .limit(1)
      .single()

    if (anyError || !anyHook) {
      return null
    }

    return anyHook
  }

  return data[0]
}

export async function getAllHooks(): Promise<Hook[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('hooks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching hooks:', error)
    return []
  }

  return data || []
}

export async function getFlaggedHooks(): Promise<Hook[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('hooks')
    .select('*')
    .eq('is_flagged', true)
    .order('green_percentage', { ascending: true })

  if (error) {
    console.error('Error fetching flagged hooks:', error)
    return []
  }

  return data || []
}

export async function createHook(text: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Verify user is admin
  const { data: userData } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!userData?.is_admin) {
    return { error: 'Not authorized' }
  }

  const { data, error } = await supabase
    .from('hooks')
    .insert({ text, created_by: user.id })
    .select()
    .single()

  if (error) {
    console.error('Error creating hook:', error)
    return { error: error.message }
  }

  revalidatePath('/admin')
  return { success: true, data }
}

export async function updateHook(id: string, text: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Verify user is admin
  const { data: userData } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!userData?.is_admin) {
    return { error: 'Not authorized' }
  }

  const { data, error } = await supabase
    .from('hooks')
    .update({ text, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating hook:', error)
    return { error: error.message }
  }

  revalidatePath('/admin')
  return { success: true, data }
}

export async function deleteHook(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Verify user is admin
  const { data: userData } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!userData?.is_admin) {
    return { error: 'Not authorized' }
  }

  const { error } = await supabase
    .from('hooks')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting hook:', error)
    return { error: error.message }
  }

  revalidatePath('/admin')
  return { success: true }
}

export async function unflagHook(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Verify user is admin
  const { data: userData } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!userData?.is_admin) {
    return { error: 'Not authorized' }
  }

  const { data, error } = await supabase
    .from('hooks')
    .update({ is_flagged: false, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error unflagging hook:', error)
    return { error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/flagged')
  return { success: true, data }
}
