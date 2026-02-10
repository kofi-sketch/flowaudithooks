'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ContentType } from '@/lib/types/database'
import { CONTENT_TYPE_LABELS, CONTENT_TYPE_ROUTES } from '@/lib/constants/content-types'

export default function ContentTypeNav() {
  const pathname = usePathname()

  const navItems: { type: ContentType; label: string; href: string }[] = [
    { type: 'hook', label: CONTENT_TYPE_LABELS.hook, href: CONTENT_TYPE_ROUTES.hook },
    { type: 'bridge', label: CONTENT_TYPE_LABELS.bridge, href: CONTENT_TYPE_ROUTES.bridge },
    { type: 'followup', label: CONTENT_TYPE_LABELS.followup, href: CONTENT_TYPE_ROUTES.followup },
  ]

  return (
    <div className="flex gap-2 mb-8">
      {navItems.map(item => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.type}
            href={item.href}
            className={`
              px-6 py-3 rounded-lg font-medium transition-all duration-150
              ${isActive
                ? 'bg-white text-[#1a1a1a]'
                : 'bg-[#2d2d2d] text-[#a0a0a0] hover:bg-[#3a3a3a] hover:text-white'
              }
            `}
          >
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}
