import type { Hook, ContentType } from '@/lib/types/database'
import { CONTENT_TYPE_SINGULAR_LABELS } from '@/lib/constants/content-types'

interface TopContentProps {
  todayContent: Hook[]
  weekContent: Hook[]
  contentType: ContentType
}

export default function TopContent({ todayContent, weekContent, contentType }: TopContentProps) {
  const label = CONTENT_TYPE_SINGULAR_LABELS[contentType]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Today */}
      <div className="crm-card">
        <h2 className="text-xl font-semibold text-white mb-4">
          Top {label}s Today
        </h2>
        {todayContent.length === 0 ? (
          <p className="text-[#a0a0a0] text-sm">No votes today yet</p>
        ) : (
          <ul className="space-y-3">
            {todayContent.map((item, idx) => (
              <li key={item.id} className="flex items-start gap-3 p-3 bg-[#2a2a2a] rounded-lg">
                <span className="text-white font-semibold">#{idx + 1}</span>
                <div className="flex-1">
                  <p className="text-white text-sm mb-1">{item.text}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-green-500">{item.green_percentage.toFixed(0)}% success</span>
                    <span className="text-[#a0a0a0]">{item.total_votes} {item.total_votes === 1 ? 'vote' : 'votes'}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Top This Week */}
      <div className="crm-card">
        <h2 className="text-xl font-semibold text-white mb-4">
          Top {label}s This Week
        </h2>
        {weekContent.length === 0 ? (
          <p className="text-[#a0a0a0] text-sm">No votes this week yet</p>
        ) : (
          <ul className="space-y-3">
            {weekContent.map((item, idx) => (
              <li key={item.id} className="flex items-start gap-3 p-3 bg-[#2a2a2a] rounded-lg">
                <span className="text-white font-semibold">#{idx + 1}</span>
                <div className="flex-1">
                  <p className="text-white text-sm mb-1">{item.text}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-green-500">{item.green_percentage.toFixed(0)}% success</span>
                    <span className="text-[#a0a0a0]">{item.total_votes} {item.total_votes === 1 ? 'vote' : 'votes'}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
