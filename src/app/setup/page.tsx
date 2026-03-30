'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTaxStore } from '@/lib/store'
import { Key, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function SetupPage() {
  const router = useRouter()
  const { apiKey, setApiKey, onboarding, setOnboarding } = useTaxStore()
  const [showKey, setShowKey] = useState(false)
  const [step, setStep] = useState<'apikey' | 'profile'>('apikey')

  if (step === 'apikey') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Key className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Enter Your API Key</h1>
            <p className="text-gray-500 mt-2 text-sm">
              Your Anthropic API key is stored only in your browser&apos;s localStorage. It never leaves your machine.
            </p>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <label className="block text-sm font-medium mb-2">Anthropic API Key</label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
                className="w-full border rounded-lg px-4 py-3 pr-10 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
              <button onClick={() => setShowKey(!showKey)} className="absolute right-3 top-3.5 text-gray-400">
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Get your key at <a href="https://console.anthropic.com/settings/keys" className="text-green-600 hover:underline" target="_blank">console.anthropic.com</a>
            </p>
            <button
              onClick={() => apiKey.startsWith('sk-') ? setStep('profile') : null}
              disabled={!apiKey.startsWith('sk-')}
              className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-center mt-4">
            <a href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600">Skip to demo with sample data</a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Tell us about your situation</h1>
        <p className="text-gray-500 mb-8">This helps the AI agents optimize your return. All answers stay local.</p>

        <div className="bg-white rounded-xl border p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Your Name</label>
              <input value={onboarding.primaryName} onChange={(e) => setOnboarding({ primaryName: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="First Last" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Marital Status</label>
              <select value={onboarding.maritalStatus} onChange={(e) => setOnboarding({ maritalStatus: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="">Select...</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>
          </div>

          {onboarding.maritalStatus === 'married' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Spouse Name</label>
                <input value={onboarding.spouseName} onChange={(e) => setOnboarding({ spouseName: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="First Last" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Filing Preference</label>
                <select value={onboarding.filingStatus} onChange={(e) => setOnboarding({ filingStatus: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm">
                  <option value="optimize">Let AI optimize</option>
                  <option value="MFJ">Married Filing Jointly</option>
                  <option value="MFS">Married Filing Separately</option>
                </select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Employer</label>
              <input value={onboarding.employer} onChange={(e) => setOnboarding({ employer: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Amazon, Google, Meta..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">RSU Broker</label>
              <select value={onboarding.rsuBroker} onChange={(e) => setOnboarding({ rsuBroker: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="">No RSUs</option>
                <option value="Fidelity">Fidelity</option>
                <option value="Schwab">Schwab</option>
                <option value="ETrade">E*Trade / Morgan Stanley</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">State You Live In</label>
              <input value={onboarding.residentState} onChange={(e) => setOnboarding({ residentState: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="NJ" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State You Work In</label>
              <input value={onboarding.workState} onChange={(e) => setOnboarding({ workState: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="NY" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Property Tax (annual)</label>
              <input type="number" value={onboarding.propertyTax || ''} onChange={(e) => setOnboarding({ propertyTax: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="$0" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Charitable Donations (annual)</label>
              <input type="number" value={onboarding.charitableDonations || ''} onChange={(e) => setOnboarding({ charitableDonations: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="$0" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={onboarding.hasSolar} onChange={(e) => setOnboarding({ hasSolar: e.target.checked })} className="rounded" />
              <span className="text-sm">Solar panels installed</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={onboarding.hasSideBusiness} onChange={(e) => setOnboarding({ hasSideBusiness: e.target.checked })} className="rounded" />
              <span className="text-sm">Side business / freelance</span>
            </label>
          </div>

          {onboarding.hasSolar && (
            <div>
              <label className="block text-sm font-medium mb-1">Solar Installation Cost</label>
              <input type="number" value={onboarding.solarCost || ''} onChange={(e) => setOnboarding({ solarCost: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="$25,000" />
            </div>
          )}

          {onboarding.hasSideBusiness && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Business Name</label>
                <input value={onboarding.businessName} onChange={(e) => setOnboarding({ businessName: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Photography" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Total Expenses</label>
                <input type="number" value={onboarding.businessExpenses || ''} onChange={(e) => setOnboarding({ businessExpenses: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="$10,000" />
              </div>
            </div>
          )}

          <button
            onClick={() => router.push('/upload')}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center gap-2"
          >
            Upload Documents <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
