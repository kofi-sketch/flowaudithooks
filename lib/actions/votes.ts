'use server'

import { createClient } from '@/lib/supabase/server'
import type { Hook } from '@/lib/types/database'

export async function submitVote(
  hookId: string,
  voteType: 'green' | 'red' | 'star',
  sessionId: string
): Promise<{ success: boolean; hook?: Hook; error?: string }> {
  const supabase = await createClient()

  // Insert the vote
  const { error: voteError } = await supabase
    .from('votes')
    .insert({
      hook_id: hookId,
      vote_type: voteType,
      session_id: sessionId,
    })

  if (voteError) {
    console.error('Error submitting vote:', voteError)
    return { success: false, error: voteError.message }
  }

  // Fetch the updated hook stats
  const { data: updatedHook, error: hookError } = await supabase
    .from('hooks')
    .select('*')
    .eq('id', hookId)
    .single()

  if (hookError || !updatedHook) {
    console.error('Error fetching updated hook:', hookError)
    return { success: false, error: 'Could not fetch updated hook stats' }
  }

  return { success: true, hook: updatedHook }
}

export async function getVoteHistory(hookId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('votes')
    .select('*')
    .eq('hook_id', hookId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching vote history:', error)
    return []
  }

  return data || []
}

export async function getVotesBySession(sessionId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('votes')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching session votes:', error)
    return []
  }

  return data || []
}
