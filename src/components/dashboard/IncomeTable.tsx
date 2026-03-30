'use client'
import { TaxData } from '@/lib/types'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export default function IncomeTable({ data }: { data: TaxData }) {
  const { income } = data
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
      <h2 className="text-lg font-semibold mb-4">Income Summary</h2>
      <table className="w-full text-sm">
        <thead><tr className="border-b text-left text-gray-500">
          <th className="pb-2">Source</th><th className="pb-2 text-right">Amount</th>
        </tr></thead>
        <tbody className="divide-y">
          <tr><td className="py-2">{data.primary.name} W-2 ({income.wages.primary.employer})</td><td className="py-2 text-right">{fmt(income.wages.primary.wages)}</td></tr>
          {income.wages.spouse && <tr><td className="py-2">{data.spouse?.name} W-2 ({income.wages.spouse.employer})</td><td className="py-2 text-right">{fmt(income.wages.spouse.wages)}</td></tr>}
          <tr><td className="py-2">Ordinary Dividends</td><td className="py-2 text-right">{fmt(income.dividends.ordinary)}</td></tr>
          <tr><td className="py-2 pl-4 text-gray-500">of which Qualified</td><td className="py-2 text-right text-gray-500">{fmt(income.dividends.qualified)}</td></tr>
          <tr><td className="py-2">Interest</td><td className="py-2 text-right">{fmt(income.interest)}</td></tr>
          <tr><td className="py-2">Net Capital Gains</td><td className="py-2 text-right">{fmt(income.capitalGains.net)}</td></tr>
          {income.scheduleC && <tr><td className="py-2">Schedule C ({income.scheduleC.businessName})</td><td className="py-2 text-right text-red-500">{fmt(income.scheduleC.net)}</td></tr>}
          <tr className="font-bold border-t-2"><td className="pt-3">Adjusted Gross Income (AGI)</td><td className="pt-3 text-right">{fmt(income.agi)}</td></tr>
        </tbody>
      </table>
    </div>
  )
}
