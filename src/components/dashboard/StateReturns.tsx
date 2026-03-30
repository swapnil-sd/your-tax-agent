'use client'
import { TaxData } from '@/lib/types'

function fmt(n: number) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n) }

export default function StateReturns({ data }: { data: TaxData }) {
  const { ny, nj } = data.stateReturns
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
      <h2 className="text-lg font-semibold mb-4">State Returns</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium text-sm text-gray-500 mb-2">New York ({ny.form} - {ny.type})</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span>NY Wages</span><span>{fmt(ny.nyWages)}</span></div>
            <div className="flex justify-between"><span>NY Tax Calculated</span><span>{fmt(ny.nyTaxCalculated)}</span></div>
            <div className="flex justify-between"><span>NY Tax Withheld</span><span>{fmt(ny.nyTaxWithheld)}</span></div>
            <div className="flex justify-between border-t pt-2 font-bold text-green-600"><span>NY Refund</span><span>{fmt(ny.refund)}</span></div>
          </div>
        </div>
        <div>
          <h3 className="font-medium text-sm text-gray-500 mb-2">New Jersey ({nj.form} - {nj.type})</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span>NJ Gross Income</span><span>{fmt(nj.njGrossIncome)}</span></div>
            <div className="flex justify-between"><span>Property Tax Deduction</span><span>-{fmt(nj.propertyTaxDeduction)}</span></div>
            <div className="flex justify-between"><span>NJ Tax Before Credit</span><span>{fmt(nj.njTaxBeforeCredit)}</span></div>
            <div className="flex justify-between"><span>Credit for NY Taxes</span><span>-{fmt(nj.creditForNY)}</span></div>
            <div className="flex justify-between border-t pt-2 font-bold text-red-500"><span>NJ Owed</span><span>{fmt(nj.owed)}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
