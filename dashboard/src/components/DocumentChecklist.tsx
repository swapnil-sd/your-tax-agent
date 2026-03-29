'use client'
import { DocumentItem } from '@/lib/types'

const statusIcon = {
  complete: { icon: '\u2611', color: 'text-green-600' },
  needed: { icon: '\u2610', color: 'text-yellow-600' },
  missing: { icon: '\u2612', color: 'text-red-500' },
}

export default function DocumentChecklist({ items }: { items: DocumentItem[] }) {
  const complete = items.filter(i => i.status === 'complete').length
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Document Checklist</h2>
        <span className="text-sm text-gray-500">{complete}/{items.length} complete</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {items.map((item, i) => {
          const s = statusIcon[item.status]
          return (
            <div key={i} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50">
              <span className={`text-lg ${s.color}`}>{s.icon}</span>
              <span className={`text-sm ${item.status === 'complete' ? 'text-gray-700' : 'text-yellow-700 font-medium'}`}>{item.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
