'use client'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { TaxData } from '@/lib/types'

function fmt(n: number) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n) }

const COLORS = ['#3b82f6', '#f59e0b', '#8b5cf6', '#10b981']

export default function TaxChart({ data }: { data: TaxData }) {
  const { taxCalculation } = data
  const chartData = [
    { name: 'Income Tax', value: taxCalculation.incomeTax },
    { name: 'Medicare', value: taxCalculation.additionalMedicare },
    { name: 'NIIT', value: taxCalculation.niit },
    { name: 'Credits', value: taxCalculation.totalCredits },
  ].filter(d => d.value > 0)

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
      <h2 className="text-lg font-semibold mb-4">Tax Breakdown</h2>
      <div className="flex items-center gap-8">
        <div className="w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={2}>
                {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value: number) => fmt(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3 text-sm flex-1">
          <div className="flex justify-between"><span>Taxable Income</span><span className="font-medium">{fmt(taxCalculation.taxableIncome)}</span></div>
          <div className="flex justify-between"><span>Income Tax</span><span>{fmt(taxCalculation.incomeTax)}</span></div>
          <div className="flex justify-between"><span>Add'l Medicare Tax</span><span>{fmt(taxCalculation.additionalMedicare)}</span></div>
          <div className="flex justify-between"><span>NIIT</span><span>{fmt(taxCalculation.niit)}</span></div>
          <div className="flex justify-between border-t pt-2"><span className="font-medium">Gross Tax</span><span className="font-medium">{fmt(taxCalculation.grossTax)}</span></div>
          <div className="flex justify-between text-green-600"><span>Credits</span><span>-{fmt(taxCalculation.totalCredits)}</span></div>
          <div className="flex justify-between border-t pt-2 font-bold"><span>Net Tax</span><span>{fmt(taxCalculation.netTax)}</span></div>
          <div className="flex justify-between text-blue-600"><span>Total Withholding</span><span>{fmt(taxCalculation.totalWithholding)}</span></div>
          <div className="flex justify-between border-t pt-2 text-lg font-bold text-green-600"><span>Refund</span><span>{fmt(taxCalculation.result)}</span></div>
        </div>
      </div>
    </div>
  )
}
