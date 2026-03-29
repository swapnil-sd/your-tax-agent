'use client'
import { TaxData } from '@/lib/types'

function fmt(n: number) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n) }

export default function DeductionsCard({ data }: { data: TaxData }) {
  const { deductions } = data
  const pct = Math.round((deductions.itemized.total / (deductions.itemized.total + deductions.standardDeduction)) * 100)
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-lg font-semibold mb-4">Deductions</h2>
      <div className="flex gap-4 mb-4">
        <div className={`flex-1 p-4 rounded-lg border-2 ${deductions.method === 'itemized' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
          <p className="text-sm font-medium">Itemized</p>
          <p className="text-2xl font-bold">{fmt(deductions.itemized.total)}</p>
          {deductions.method === 'itemized' && <p className="text-xs text-green-600 mt-1">Selected - saves {fmt(deductions.savingsVsStandard)} more</p>}
        </div>
        <div className={`flex-1 p-4 rounded-lg border-2 ${deductions.method !== 'itemized' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
          <p className="text-sm font-medium">Standard</p>
          <p className="text-2xl font-bold">{fmt(deductions.standardDeduction)}</p>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between"><span>Mortgage interest</span><span>{fmt(deductions.itemized.mortgageInterest)}</span></div>
        <div className="flex justify-between"><span>Points</span><span>{fmt(deductions.itemized.points)}</span></div>
        <div className="flex justify-between"><span>SALT (capped)</span><span>{fmt(deductions.itemized.salt)}</span></div>
        <div className="flex justify-between"><span>Charitable</span><span>{fmt(deductions.itemized.charitable)}</span></div>
      </div>
    </div>
  )
}
