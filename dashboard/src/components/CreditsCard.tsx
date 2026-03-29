'use client'
import { TaxData } from '@/lib/types'

function fmt(n: number) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n) }

export default function CreditsCard({ data }: { data: TaxData }) {
  const { credits } = data
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-lg font-semibold mb-4">Credits</h2>
      <p className="text-3xl font-bold text-green-600 mb-4">-{fmt(credits.total)}</p>
      <div className="space-y-2 text-sm">
        {credits.solar && (
          <div className="flex justify-between">
            <span>Solar (30% of {fmt(credits.solar.cost)})</span>
            <span className="text-green-600 font-medium">{fmt(credits.solar.credit)}</span>
          </div>
        )}
        {credits.foreignTax > 0 && (
          <div className="flex justify-between">
            <span>Foreign Tax Credit</span>
            <span className="text-green-600 font-medium">{fmt(credits.foreignTax)}</span>
          </div>
        )}
        {credits.qbi > 0 && (
          <div className="flex justify-between">
            <span>QBI Deduction (Sec 199A)</span>
            <span className="text-green-600 font-medium">{fmt(credits.qbi)}</span>
          </div>
        )}
      </div>
    </div>
  )
}
