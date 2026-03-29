'use client'
import { useState } from 'react'

interface Check {
  id: number
  name: string
  category: string
  status: 'pass' | 'pass_after_retry' | 'warning' | 'error' | 'user_review_needed' | 'skipped'
  details?: string
  expected?: number
  found?: number
  responsible_agent?: string
}

interface AgentLog {
  agent: string
  status: string
  duration_ms?: number
  retry_count?: number
  decisions?: Array<{ decision: string; reason: string }>
  warnings?: string[]
  errors?: string[]
}

interface AuditData {
  review?: {
    total_checks: number
    passed: number
    warnings: number
    errors: number
    user_review_needed: number
    checks: Check[]
  }
  agents?: Record<string, AgentLog>
}

const statusConfig = {
  pass: { bg: 'bg-green-100', text: 'text-green-800', icon: '\u2713', label: 'Pass' },
  pass_after_retry: { bg: 'bg-blue-100', text: 'text-blue-800', icon: '\u21bb', label: 'Fixed' },
  warning: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '\u26a0', label: 'Warning' },
  error: { bg: 'bg-red-100', text: 'text-red-800', icon: '\u2717', label: 'Error' },
  user_review_needed: { bg: 'bg-red-100', text: 'text-red-800', icon: '\u2753', label: 'Review' },
  skipped: { bg: 'bg-gray-100', text: 'text-gray-500', icon: '\u2014', label: 'Skipped' },
}

const categoryLabels: Record<string, string> = {
  math_consistency: 'Math Consistency',
  irs_limits: 'IRS Limits & Caps',
  rsu_basis: 'RSU Basis Validation',
  cross_agent: 'Cross-Agent Consistency',
  state_return: 'State Return Validation',
  filing_status: 'Filing Status & Eligibility',
}

export default function AuditTrail({ data }: { data: AuditData }) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showAllChecks, setShowAllChecks] = useState(false)

  if (!data?.review) return null

  const { review, agents } = data
  const allPassed = review.errors === 0 && review.user_review_needed === 0

  // Group checks by category
  const grouped = review.checks.reduce<Record<string, Check[]>>((acc, check) => {
    const cat = check.category || 'other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(check)
    return acc
  }, {})

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Compliance Review</h2>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${allPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {allPassed ? '\u2713 All Checks Passed' : `${review.errors} Error(s), ${review.warnings} Warning(s)`}
        </div>
      </div>

      {/* Summary bar */}
      <div className="flex gap-4 mb-4 text-sm">
        <span className="text-green-600">{review.passed} passed</span>
        {review.warnings > 0 && <span className="text-yellow-600">{review.warnings} warnings</span>}
        {review.errors > 0 && <span className="text-red-600">{review.errors} errors</span>}
        {review.user_review_needed > 0 && <span className="text-red-600">{review.user_review_needed} need review</span>}
        <span className="text-gray-400">/ {review.total_checks} total</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-100 rounded-full mb-6 flex overflow-hidden">
        <div className="bg-green-500 h-full" style={{ width: `${(review.passed / review.total_checks) * 100}%` }} />
        <div className="bg-yellow-400 h-full" style={{ width: `${(review.warnings / review.total_checks) * 100}%` }} />
        <div className="bg-red-500 h-full" style={{ width: `${(review.errors / review.total_checks) * 100}%` }} />
      </div>

      {/* Non-pass checks first */}
      {review.checks.filter(c => c.status !== 'pass').map((check) => {
        const cfg = statusConfig[check.status]
        return (
          <div key={check.id} className={`${cfg.bg} rounded-lg p-3 mb-2 flex items-start gap-3`}>
            <span className={`${cfg.text} text-lg`}>{cfg.icon}</span>
            <div className="flex-1">
              <div className="flex justify-between">
                <span className={`font-medium ${cfg.text}`}>#{check.id} {check.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
              </div>
              {check.details && <p className="text-sm mt-1 text-gray-700">{check.details}</p>}
              {check.expected !== undefined && (
                <p className="text-xs text-gray-500 mt-1">Expected: {check.expected?.toLocaleString()} | Found: {check.found?.toLocaleString()}</p>
              )}
            </div>
          </div>
        )
      })}

      {/* Toggle to show all checks */}
      <button onClick={() => setShowAllChecks(!showAllChecks)} className="text-sm text-blue-600 hover:underline mt-2 mb-4">
        {showAllChecks ? 'Hide passed checks' : `Show all ${review.total_checks} checks`}
      </button>

      {showAllChecks && Object.entries(grouped).map(([category, checks]) => (
        <div key={category} className="mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            {categoryLabels[category] || category}
          </h3>
          <div className="space-y-1">
            {checks.map(check => {
              const cfg = statusConfig[check.status]
              return (
                <div key={check.id} className="flex items-center gap-2 text-sm py-1">
                  <span className={cfg.text}>{cfg.icon}</span>
                  <span className="text-gray-700">#{check.id} {check.name}</span>
                  {check.details && <span className="text-gray-400 text-xs">— {check.details}</span>}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Agent logs */}
      {agents && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">Agent Execution Log</h3>
          <div className="space-y-2">
            {Object.entries(agents).map(([name, log]) => (
              <div key={name}>
                <button
                  onClick={() => setExpanded(expanded === name ? null : name)}
                  className="w-full flex items-center justify-between p-2 rounded hover:bg-gray-50 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className={log.status === 'success' ? 'text-green-500' : 'text-yellow-500'}>
                      {log.status === 'success' ? '\u2713' : '\u26a0'}
                    </span>
                    <span className="font-medium">{name}</span>
                    {log.retry_count ? <span className="text-xs text-yellow-600">(retried {log.retry_count}x)</span> : null}
                  </div>
                  <span className="text-gray-400 text-xs">{log.duration_ms ? `${(log.duration_ms / 1000).toFixed(1)}s` : ''}</span>
                </button>
                {expanded === name && (
                  <div className="ml-8 p-3 bg-gray-50 rounded text-xs space-y-2">
                    {log.decisions?.map((d, i) => (
                      <div key={i}><span className="font-medium">{d.decision}</span> — {d.reason}</div>
                    ))}
                    {log.warnings?.map((w, i) => <div key={i} className="text-yellow-600">{w}</div>)}
                    {log.errors?.map((e, i) => <div key={i} className="text-red-600">{e}</div>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
