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

export interface BulkImportResult {
  success: boolean
  created: number
  skipped: number
  errors: Array<{ row: number; text: string; reason: string }>
}

export async function bulkCreateHooks(hooksData: Array<{ text: string }>): Promise<BulkImportResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return {
      success: false,
      created: 0,
      skipped: 0,
      errors: [{ row: 0, text: '', reason: 'Not authenticated' }]
    }
  }

  // Verify user is admin
  const { data: userData } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!userData?.is_admin) {
    return {
      success: false,
      created: 0,
      skipped: 0,
      errors: [{ row: 0, text: '', reason: 'Not authorized' }]
    }
  }

  const validHooks: Array<{ text: string; created_by: string }> = []
  const errors: Array<{ row: number; text: string; reason: string }> = []
  let skipped = 0

  // Get all existing hook texts for duplicate checking
  const { data: existingHooks } = await supabase
    .from('hooks')
    .select('text')

  const existingTexts = new Set(
    existingHooks?.map(h => h.text.trim().toLowerCase()) || []
  )

  // Validate each hook
  for (let i = 0; i < hooksData.length; i++) {
    const hookData = hooksData[i]
    const trimmedText = hookData.text.trim()
    const rowNumber = i + 1

    // Empty check
    if (!trimmedText) {
      errors.push({
        row: rowNumber,
        text: hookData.text,
        reason: 'Empty text'
      })
      continue
    }

    // Length check
    if (trimmedText.length > 1000) {
      errors.push({
        row: rowNumber,
        text: hookData.text,
        reason: 'Text too long (max 1000 characters)'
      })
      continue
    }

    // Duplicate check
    if (existingTexts.has(trimmedText.toLowerCase())) {
      skipped++
      continue
    }

    // Add to valid hooks
    validHooks.push({ text: trimmedText, created_by: user.id })

    // Add to existing texts to prevent duplicates within the same batch
    existingTexts.add(trimmedText.toLowerCase())
  }

  // Batch insert valid hooks
  let created = 0
  if (validHooks.length > 0) {
    const { data, error } = await supabase
      .from('hooks')
      .insert(validHooks)
      .select()

    if (error) {
      console.error('Error bulk creating hooks:', error)
      return {
        success: false,
        created: 0,
        skipped,
        errors: [{ row: 0, text: '', reason: error.message }]
      }
    }

    created = data?.length || 0
  }

  revalidatePath('/admin')
  return {
    success: true,
    created,
    skipped,
    errors
  }
}
