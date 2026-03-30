'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTaxStore } from '@/lib/store'
import { FileSearch, Calculator, GitBranch, MapPin, Shield, CheckCircle2, Loader2 } from 'lucide-react'

const agents = [
  { id: 'doc_processor', name: 'Document Processor', icon: FileSearch, desc: 'Reading and classifying tax documents' },
  { id: 'tax_strategist', name: 'Tax Strategist', icon: Calculator, desc: 'Optimizing filing status and deductions' },
  { id: 'rsu_specialist', name: 'RSU Specialist', icon: GitBranch, desc: 'Correcting sell-to-cover cost basis' },
  { id: 'state_expert', name: 'State Tax Expert', icon: MapPin, desc: 'Calculating NY + NJ returns' },
  { id: 'reviewer', name: 'IRS Compliance Reviewer', icon: Shield, desc: 'Running 30 validation checks' },
]

const phases = ['Ingesting', 'Analyzing', 'Reviewing', 'Complete']

export default function ProcessingPage() {
  const router = useRouter()
  const { files, apiKey, onboarding, setResults, agentProgress, updateAgentProgress, processingStatus, setProcessingStatus } = useTaxStore()
  const [currentPhase, setCurrentPhase] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (processingStatus !== 'idle') return
    if (!apiKey || files.length === 0) {
      // Demo mode: load sample data after simulated processing
      simulateDemo()
      return
    }

    startProcessing()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function simulateDemo() {
    setProcessingStatus('running')
    const agentIds = agents.map(a => a.id)

    for (let i = 0; i < agentIds.length; i++) {
      updateAgentProgress(agentIds[i], { status: 'running', progress: 0, message: 'Starting...' })
      await new Promise(r => setTimeout(r, 400))

      for (let p = 0; p <= 100; p += 20) {
        updateAgentProgress(agentIds[i], { status: 'running', progress: p, message: `Processing... ${p}%` })
        await new Promise(r => setTimeout(r, 150))
      }

      updateAgentProgress(agentIds[i], { status: 'complete', progress: 100, message: 'Done' })
      if (i < 3) setCurrentPhase(Math.min(i + 1, 2))
    }

    setCurrentPhase(3)
    // Load sample data
    try {
      const res = await fetch('/sample-data.json')
      const data = await res.json()
      setResults(data)
    } catch {}

    setProcessingStatus('complete')
    await new Promise(r => setTimeout(r, 1000))
    router.push('/dashboard')
  }

  async function startProcessing() {
    setProcessingStatus('running')

    try {
      const formData = new FormData()
      files.forEach(f => formData.append('files', f))
      formData.append('apiKey', apiKey)
      formData.append('onboarding', JSON.stringify(onboarding))

      const res = await fetch('/api/process', { method: 'POST', body: formData })

      if (!res.ok) throw new Error(`API error: ${res.status}`)

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error('No response stream')

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value)
        const lines = text.split('\n').filter(l => l.startsWith('data: '))

        for (const line of lines) {
          try {
            const event = JSON.parse(line.slice(6))

            if (event.type === 'agent_progress') {
              updateAgentProgress(event.agent, { status: event.status, progress: event.progress, message: event.message })
            } else if (event.type === 'phase') {
              setCurrentPhase(phases.indexOf(event.phase))
            } else if (event.type === 'complete') {
              setResults(event.data)
              setProcessingStatus('complete')
              router.push('/dashboard')
            } else if (event.type === 'error') {
              setError(event.message)
              setProcessingStatus('error')
            }
          } catch {}
        }
      }
    } catch (err) {
      setError(String(err))
      setProcessingStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Analyzing Your Taxes</h1>
        <p className="text-gray-500 mb-8">5 specialized AI agents are working on your return.</p>

        {/* Phase indicator */}
        <div className="flex items-center gap-2 mb-8">
          {phases.map((phase, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                i < currentPhase ? 'bg-green-600 text-white' :
                i === currentPhase ? 'bg-green-100 text-green-700 ring-2 ring-green-600' :
                'bg-gray-200 text-gray-500'
              }`}>
                {i < currentPhase ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-sm ${i <= currentPhase ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>{phase}</span>
              {i < phases.length - 1 && <div className={`w-8 h-0.5 ${i < currentPhase ? 'bg-green-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* Agent cards */}
        <div className="space-y-3">
          {agents.map((agent) => {
            const progress = agentProgress[agent.id]
            const isRunning = progress?.status === 'running'
            const isComplete = progress?.status === 'complete'

            return (
              <div key={agent.id} className={`bg-white rounded-xl border p-4 transition ${isComplete ? 'border-green-200' : isRunning ? 'border-green-400 shadow-sm' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      isComplete ? 'bg-green-100' : isRunning ? 'bg-green-50' : 'bg-gray-100'
                    }`}>
                      {isRunning ? <Loader2 className="w-4 h-4 text-green-600 animate-spin" /> :
                       isComplete ? <CheckCircle2 className="w-4 h-4 text-green-600" /> :
                       <agent.icon className="w-4 h-4 text-gray-400" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{agent.name}</p>
                      <p className="text-xs text-gray-400">{progress?.message || agent.desc}</p>
                    </div>
                  </div>
                  {progress && (
                    <span className={`text-xs font-medium ${isComplete ? 'text-green-600' : 'text-gray-400'}`}>
                      {progress.progress}%
                    </span>
                  )}
                </div>
                {isRunning && (
                  <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress.progress}%` }} />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
