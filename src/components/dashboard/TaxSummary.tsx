'use client'
import { TaxData } from '@/lib/types'

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Math.abs(n))
}

export default function TaxSummary({ data }: { data: TaxData }) {
  const { summary } = data
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <p className="text-sm text-gray-500 uppercase tracking-wide">Federal</p>
        <p className="text-3xl font-bold text-green-600 mt-1">{formatCurrency(summary.federalRefund)}</p>
        <p className="text-sm text-green-600 mt-1">Refund</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <p className="text-sm text-gray-500 uppercase tracking-wide">New York</p>
        <p className="text-3xl font-bold text-green-600 mt-1">{formatCurrency(summary.nyRefund)}</p>
        <p className="text-sm text-green-600 mt-1">Refund</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <p className="text-sm text-gray-500 uppercase tracking-wide">New Jersey</p>
        <p className="text-3xl font-bold text-red-500 mt-1">{formatCurrency(summary.njOwed)}</p>
        <p className="text-sm text-red-500 mt-1">Owed</p>
      </div>

      <div className="md:col-span-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-green-700 font-medium">Total Getting Back</p>
          <p className="text-4xl font-bold text-green-700">{formatCurrency(summary.totalBack)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Without optimization, you would owe</p>
          <p className="text-lg text-red-500 line-through">{formatCurrency(summary.naiveApproachOwed)}</p>
          <p className="text-sm text-green-700 font-semibold mt-1">Total swing: {formatCurrency(summary.totalSwing)}</p>
        </div>
      </div>
    </div>
  )
}
