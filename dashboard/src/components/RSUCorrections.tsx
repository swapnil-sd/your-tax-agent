'use client'
import { TaxData } from '@/lib/types'

function fmt(n: number) { return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }) }
function fmtInt(n: number) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n) }

export default function RSUCorrections({ data }: { data: TaxData }) {
  const { rsuCorrections } = data
  const sections = [
    { name: data.primary.name, correction: rsuCorrections.primary },
    ...(rsuCorrections.spouse ? [{ name: data.spouse?.name || 'Spouse', correction: rsuCorrections.spouse }] : []),
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">RSU Basis Corrections</h2>
        <span className="text-green-600 font-bold">Saved {fmtInt(rsuCorrections.combinedSavings)}</span>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Without correction, {fmtInt(rsuCorrections.primary.phantomIncomeEliminated + (rsuCorrections.spouse?.phantomIncomeEliminated || 0))} in phantom income would be double-taxed.
      </p>

      {sections.map(({ name, correction }, si) => (
        <div key={si} className="mb-6">
          <h3 className="font-medium text-sm text-gray-700 mb-2">{name} -- {fmtInt(correction.taxSaved)} saved</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="border-b text-left text-gray-500">
                <th className="pb-1 pr-3">Date</th>
                <th className="pb-1 pr-3 text-right">Shares</th>
                <th className="pb-1 pr-3 text-right">Proceeds</th>
                <th className="pb-1 pr-3 text-right">Reported Basis</th>
                <th className="pb-1 pr-3 text-right">Correct Basis</th>
                <th className="pb-1 text-right">Actual Gain</th>
              </tr></thead>
              <tbody className="divide-y">
                {correction.transactions.map((t, i) => (
                  <tr key={i}>
                    <td className="py-1 pr-3">{t.date}</td>
                    <td className="py-1 pr-3 text-right">{t.shares.toFixed(3)}</td>
                    <td className="py-1 pr-3 text-right">{fmt(t.proceeds)}</td>
                    <td className="py-1 pr-3 text-right text-red-500">$0.00</td>
                    <td className="py-1 pr-3 text-right text-green-600">{fmt(t.basis)}</td>
                    <td className="py-1 text-right">{fmt(t.gain)}</td>
                  </tr>
                ))}
                <tr className="font-semibold border-t">
                  <td className="pt-2">Total</td>
                  <td></td>
                  <td className="pt-2 text-right">{fmt(correction.totalProceeds)}</td>
                  <td className="pt-2 text-right text-red-500">$0.00</td>
                  <td className="pt-2 text-right text-green-600">{fmt(correction.correctedBasis)}</td>
                  <td className="pt-2 text-right">{fmt(correction.actualGain)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}
