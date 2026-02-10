/**
 * Get or create a session ID for tracking user sessions
 * Stored in sessionStorage to persist across page refreshes but not across browser sessions
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') {
    return 'server-session'
  }

  const STORAGE_KEY = 'hook-tester-session-id'

  let sessionId = sessionStorage.getItem(STORAGE_KEY)

  if (!sessionId) {
    // Generate a new session ID
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
    sessionStorage.setItem(STORAGE_KEY, sessionId)
  }

  return sessionId
}

/**
 * Clear the current session (useful for testing)
 */
export function clearSession(): void {
  if (typeof window === 'undefined') {
    return
  }

  const STORAGE_KEY = 'hook-tester-session-id'
  sessionStorage.removeItem(STORAGE_KEY)
}
