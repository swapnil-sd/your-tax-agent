'use client'
import Link from 'next/link'
import { Shield, DollarSign, FileCheck, BarChart3, Zap, Lock, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react'

const features = [
  { icon: DollarSign, title: 'RSU Basis Correction', desc: 'Catches the #1 tax mistake for tech workers. Brokers report $0 cost basis on sell-to-cover sales — we fix it.', savings: '$3K–$15K+' },
  { icon: BarChart3, title: 'MFJ vs MFS Optimizer', desc: 'Calculates your exact tax under both filing statuses and shows the dollar difference.', savings: '$2K–$8K' },
  { icon: FileCheck, title: '30 IRS Compliance Checks', desc: 'Every number validated against IRS rules before you see it. SALT caps, mortgage limits, capital loss limits.', savings: 'Error prevention' },
  { icon: Shield, title: 'Multi-State Filing', desc: 'NY non-resident + NJ resident returns with credit calculations. No double taxation.', savings: 'Correct allocation' },
  { icon: Zap, title: 'Smart Deduction Analysis', desc: 'Compares itemized vs standard, finds mortgage interest, SALT, charitable, and Schedule C deductions.', savings: '$2K–$7K' },
  { icon: Lock, title: '100% Local & Private', desc: 'Documents never leave your machine. No accounts, no cloud storage. Your API key stays in your browser.', savings: 'Peace of mind' },
]

const steps = [
  { num: '01', title: 'Enter Your Info', desc: 'Answer a few questions about your situation — filing status, employer, states, side business.' },
  { num: '02', title: 'Upload Documents', desc: 'Drag and drop your W-2s, 1099s, 1098s, and RSU vesting records.' },
  { num: '03', title: 'AI Analyzes', desc: '5 specialized agents work in parallel — extracting, optimizing, correcting, and validating.' },
  { num: '04', title: 'Get Your Guide', desc: 'Complete filing guide with field-by-field TurboTax instructions, interactive dashboard, and PDF.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">your-tax-agent</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://github.com/swapnil-sd/your-tax-agent" className="text-sm text-gray-500 hover:text-gray-900">GitHub</a>
            <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">Demo</Link>
            <Link href="/setup" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <CheckCircle2 className="w-4 h-4" />
            Saved $17,000+ on a real return
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Stop overpaying taxes.
            <br />
            <span className="text-green-600">AI finds what your CPA missed.</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            Built for tech workers with RSUs. Upload your tax documents, get an optimized filing guide with field-by-field TurboTax instructions.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/setup" className="bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition flex items-center gap-2">
              Start Filing <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/dashboard" className="border border-gray-200 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition">
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 px-6 bg-red-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-4 bg-white rounded-2xl p-8 shadow-sm border border-red-100">
            <AlertTriangle className="w-8 h-8 text-red-500 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold mb-3">The RSU Problem Nobody Talks About</h2>
              <p className="text-gray-600 mb-4">
                When your RSUs vest, your broker reports the sold shares with <strong>$0 cost basis</strong> on your 1099-B.
                Without correction, you pay tax on the same income twice — once through your paycheck, again on your tax return.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                  <p className="text-sm text-red-600 font-medium mb-1">Without Correction</p>
                  <p className="font-mono text-sm">Proceeds: $14,069</p>
                  <p className="font-mono text-sm">Basis: $0</p>
                  <p className="font-mono text-sm font-bold text-red-600">Tax: $4,502</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <p className="text-sm text-green-600 font-medium mb-1">With your-tax-agent</p>
                  <p className="font-mono text-sm">Proceeds: $14,069</p>
                  <p className="font-mono text-sm">Basis: $14,068</p>
                  <p className="font-mono text-sm font-bold text-green-600">Tax: $0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">What It Finds</h2>
          <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
            8 specialized AI agents analyze your return from every angle.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="border rounded-xl p-6 hover:shadow-md transition group">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-100 transition">
                  <f.icon className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{f.desc}</p>
                <span className="text-sm font-medium text-green-600">{f.savings}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-8">
            {steps.map((s, i) => (
              <div key={i} className="flex items-start gap-6">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {s.num}
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-1">{s.title}</h3>
                  <p className="text-gray-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Built for Tech Workers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Amazon', 'Google', 'Meta', 'Apple', 'Microsoft', 'Fidelity', 'Schwab', 'E*Trade'].map(name => (
              <div key={name} className="border rounded-lg py-3 px-4 text-sm font-medium text-gray-600">
                {name}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-400 mt-4">RSU vesting records from any of these brokers are supported</p>
        </div>
      </section>

      {/* Privacy */}
      <section className="py-16 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Lock className="w-10 h-10 mx-auto mb-4 text-green-400" />
          <h2 className="text-3xl font-bold mb-4">Your Data Never Leaves Your Machine</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Everything runs locally. No accounts, no cloud uploads, no tracking.
            Your Anthropic API key stays in your browser. Documents are processed in memory and never stored.
          </p>
          <div className="flex justify-center gap-8 text-sm text-gray-400">
            <span>No accounts</span>
            <span>No cloud storage</span>
            <span>No tracking</span>
            <span>MIT licensed</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to stop overpaying?</h2>
          <p className="text-xl text-gray-500 mb-8">
            Takes 5 minutes. You just need your tax documents and an Anthropic API key.
          </p>
          <Link href="/setup" className="bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition inline-flex items-center gap-2">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-gray-400 mt-4">Open source. You only pay for Claude API usage (~$2-5 per return).</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-sm text-gray-400">
          <span>your-tax-agent &mdash; MIT License</span>
          <div className="flex gap-6">
            <a href="https://github.com/swapnil-sd/your-tax-agent" className="hover:text-gray-600">GitHub</a>
            <a href="https://github.com/swapnil-sd/your-tax-agent/blob/main/docs/how-rsu-basis-works.md" className="hover:text-gray-600">RSU Guide</a>
            <a href="https://github.com/swapnil-sd/your-tax-agent/blob/main/docs/architecture.md" className="hover:text-gray-600">Architecture</a>
          </div>
        </div>
        <p className="max-w-6xl mx-auto text-xs text-gray-300 mt-4">
          Not professional tax advice. Consult a licensed CPA or tax attorney before filing.
        </p>
      </footer>
    </div>
  )
}
