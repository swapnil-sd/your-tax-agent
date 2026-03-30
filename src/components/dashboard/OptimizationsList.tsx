'use client'
import { Optimization } from '@/lib/types'

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

const riskColors = {
  safe: 'bg-green-100 text-green-800',
  moderate: 'bg-yellow-100 text-yellow-800',
  aggressive: 'bg-red-100 text-red-800',
}

export default function OptimizationsList({ optimizations }: { optimizations: Optimization[] }) {
  const total = optimizations.reduce((sum, o) => sum + o.savings, 0)
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Optimizations Applied</h2>
        <span className="text-green-600 font-bold">Total: {formatCurrency(total)}</span>
      </div>
      <div className="space-y-3">
        {optimizations.map((opt, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
            <div className="flex items-center gap-3">
              <span className="text-green-500 text-lg">&#10003;</span>
              <div>
                <p className="font-medium">{opt.name}</p>
                <p className="text-sm text-gray-500">{opt.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-0.5 rounded-full ${riskColors[opt.risk]}`}>{opt.risk}</span>
              <span className="font-semibold text-green-600 w-24 text-right">{formatCurrency(opt.savings)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
