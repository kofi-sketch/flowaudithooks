import type { ContentType } from '@/lib/types/database'

export const CONTENT_TYPES: Record<ContentType, ContentType> = {
  hook: 'hook',
  bridge: 'bridge',
  followup: 'followup',
}

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  hook: 'Hooks',
  bridge: 'Bridges',
  followup: 'Follow-ups',
}

export const CONTENT_TYPE_SINGULAR_LABELS: Record<ContentType, string> = {
  hook: 'Hook',
  bridge: 'Bridge',
  followup: 'Follow-up',
}

export const CONTENT_TYPE_ROUTES: Record<ContentType, string> = {
  hook: '/test/hooks',
  bridge: '/test/bridges',
  followup: '/test/follow-ups',
}

export const CONTENT_TYPE_IMPORT_ROUTES: Record<ContentType, string> = {
  hook: '/admin/hooks/import',
  bridge: '/admin/bridges/import',
  followup: '/admin/follow-ups/import',
}
