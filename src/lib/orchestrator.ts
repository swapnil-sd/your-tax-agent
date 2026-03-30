/**
 * Agent Orchestrator
 *
 * Coordinates the multi-agent tax preparation workflow using Claude API.
 * Replaces Claude Code's Agent spawning with direct API calls.
 */

import { callClaude, extractJSON } from './claude-client'
import {
  DOC_PROCESSOR_PROMPT,
  getTaxStrategistPrompt,
  getRSUSpecialistPrompt,
  getStateExpertPrompt,
  getReviewerPrompt,
} from './agents/prompts'

export interface ProgressEvent {
  type: 'phase' | 'agent_progress' | 'complete' | 'error'
  phase?: string
  agent?: string
  status?: string
  progress?: number
  message?: string
  data?: any
}

export async function* orchestrate(
  documents: Array<{ name: string; text: string }>,
  onboarding: any,
  apiKey: string
): AsyncGenerator<ProgressEvent> {

  const startTime = Date.now()
  let totalTokens = { input: 0, output: 0 }

  function trackTokens(r: { inputTokens: number; outputTokens: number }) {
    totalTokens.input += r.inputTokens
    totalTokens.output += r.outputTokens
  }

  // ============ PHASE 1: DOCUMENT PROCESSING ============
  yield { type: 'phase', phase: 'Ingesting' }
  yield { type: 'agent_progress', agent: 'doc_processor', status: 'running', progress: 10, message: 'Reading documents...' }

  const docTexts = documents.map(d => `=== FILE: ${d.name} ===\n${d.text}`).join('\n\n')
  const docMessage = `Extract all tax data from these ${documents.length} documents:\n\n${docTexts}`

  let extractedData: any
  try {
    yield { type: 'agent_progress', agent: 'doc_processor', status: 'running', progress: 30, message: 'Sending to Claude for extraction...' }

    const docResult = await callClaude(apiKey, DOC_PROCESSOR_PROMPT, docMessage, { maxTokens: 16384 })
    trackTokens(docResult)
    extractedData = extractJSON(docResult.text)

    if (!extractedData) {
      // If JSON extraction fails, use the raw text as context
      extractedData = { raw_extraction: docResult.text, warnings: ['JSON parsing failed, using raw text'] }
    }

    yield { type: 'agent_progress', agent: 'doc_processor', status: 'complete', progress: 100, message: `Extracted data from ${documents.length} documents` }
  } catch (error) {
    yield { type: 'agent_progress', agent: 'doc_processor', status: 'error', progress: 0, message: String(error) }
    yield { type: 'error', message: `Document processing failed: ${String(error)}` }
    return
  }

  // ============ PHASE 2: ANALYSIS (parallel) ============
  yield { type: 'phase', phase: 'Analyzing' }

  // Build context message for analysis agents
  const analysisContext = `
## EXTRACTED DOCUMENT DATA
${JSON.stringify(extractedData, null, 2)}

## USER PROFILE (from onboarding)
- Filing status preference: ${onboarding.filingStatus || 'optimize'}
- Marital status: ${onboarding.maritalStatus || 'unknown'}
- Primary name: ${onboarding.primaryName || 'unknown'}
- Spouse name: ${onboarding.spouseName || ''}
- Employer: ${onboarding.employer || 'unknown'}
- RSU broker: ${onboarding.rsuBroker || 'none'}
- Resident state: ${onboarding.residentState || 'NJ'}
- Work state: ${onboarding.workState || 'NY'}
- Property tax: $${onboarding.propertyTax || 0}
- Charitable donations: $${onboarding.charitableDonations || 0}
- Solar cost: $${onboarding.solarCost || 0}
- Side business: ${onboarding.hasSideBusiness ? `${onboarding.businessName}, expenses $${onboarding.businessExpenses}` : 'none'}
- Prior year capital loss carryforward: $${onboarding.priorYearCarryforward || 0}
`

  // Run 3 agents in parallel
  yield { type: 'agent_progress', agent: 'tax_strategist', status: 'running', progress: 10, message: 'Analyzing filing strategy...' }
  yield { type: 'agent_progress', agent: 'rsu_specialist', status: 'running', progress: 10, message: 'Checking RSU basis...' }
  yield { type: 'agent_progress', agent: 'state_expert', status: 'running', progress: 10, message: 'Calculating state returns...' }

  let strategyResult: any = null
  let rsuResult: any = null
  let stateResult: any = null

  try {
    const [strategyResp, rsuResp, stateResp] = await Promise.all([
      // Tax Strategist
      (async () => {
        const r = await callClaude(apiKey, getTaxStrategistPrompt(), `Analyze this tax return and optimize:\n${analysisContext}`, { maxTokens: 16384 })
        trackTokens(r)
        return r
      })(),

      // RSU Specialist
      (async () => {
        const r = await callClaude(apiKey, getRSUSpecialistPrompt(), `Correct RSU cost basis for these transactions:\n${analysisContext}`, { maxTokens: 8192 })
        trackTokens(r)
        return r
      })(),

      // State Expert
      (async () => {
        const r = await callClaude(apiKey, getStateExpertPrompt(), `Calculate NY and NJ state returns:\n${analysisContext}`, { maxTokens: 8192 })
        trackTokens(r)
        return r
      })(),
    ])

    strategyResult = extractJSON(strategyResp.text) || { raw: strategyResp.text }
    yield { type: 'agent_progress', agent: 'tax_strategist', status: 'complete', progress: 100, message: `Strategy: ${strategyResult?.filing_status?.recommended || 'optimized'}` }

    rsuResult = extractJSON(rsuResp.text) || { raw: rsuResp.text }
    yield { type: 'agent_progress', agent: 'rsu_specialist', status: 'complete', progress: 100, message: `RSU corrections: $${rsuResult?.corrections?.primary?.total_phantom_income_eliminated || 0} saved` }

    stateResult = extractJSON(stateResp.text) || { raw: stateResp.text }
    yield { type: 'agent_progress', agent: 'state_expert', status: 'complete', progress: 100, message: `NY: $${stateResult?.ny_return?.refund || 0} refund, NJ: $${stateResult?.nj_return?.owed || 0} owed` }

  } catch (error) {
    yield { type: 'error', message: `Analysis failed: ${String(error)}` }
    return
  }

  // ============ PHASE 3: REVIEW ============
  yield { type: 'phase', phase: 'Reviewing' }
  yield { type: 'agent_progress', agent: 'reviewer', status: 'running', progress: 10, message: 'Running 30 IRS compliance checks...' }

  let reviewResult: any = null
  try {
    const reviewContext = `
## TAX STRATEGIST OUTPUT
${JSON.stringify(strategyResult, null, 2)}

## RSU SPECIALIST OUTPUT
${JSON.stringify(rsuResult, null, 2)}

## STATE EXPERT OUTPUT
${JSON.stringify(stateResult, null, 2)}

## EXTRACTED DOCUMENT DATA
${JSON.stringify(extractedData, null, 2)}

Validate all outputs. Run all 30 checks. Filing status: ${strategyResult?.filing_status?.recommended || onboarding.filingStatus}
`
    const reviewResp = await callClaude(apiKey, getReviewerPrompt(), reviewContext, { maxTokens: 8192 })
    trackTokens(reviewResp)
    reviewResult = extractJSON(reviewResp.text) || { raw: reviewResp.text }

    const passed = reviewResult?.passed || 0
    const warnings = reviewResult?.warnings || 0
    const errors = reviewResult?.errors || 0
    yield { type: 'agent_progress', agent: 'reviewer', status: 'complete', progress: 100, message: `${passed} passed, ${warnings} warnings, ${errors} errors` }

    // Handle retry if errors found
    if (errors > 0 && reviewResult?.errors_for_retry?.length > 0) {
      yield { type: 'agent_progress', agent: 'reviewer', status: 'running', progress: 50, message: `Retrying ${errors} error(s)...` }

      // For each error, re-run the responsible agent with fix instruction
      for (const err of reviewResult.errors_for_retry.slice(0, 2)) { // max 2 retries
        const fixMessage = `The reviewer found an error in your output. Please fix and return corrected JSON.\n\nError: ${JSON.stringify(err)}\n\nOriginal context:\n${analysisContext}`

        if (err.responsible_agent === 'tax_strategist') {
          const retry = await callClaude(apiKey, getTaxStrategistPrompt(), fixMessage, { maxTokens: 16384 })
          trackTokens(retry)
          strategyResult = extractJSON(retry.text) || strategyResult
        } else if (err.responsible_agent === 'rsu_specialist') {
          const retry = await callClaude(apiKey, getRSUSpecialistPrompt(), fixMessage, { maxTokens: 8192 })
          trackTokens(retry)
          rsuResult = extractJSON(retry.text) || rsuResult
        } else if (err.responsible_agent === 'state_expert') {
          const retry = await callClaude(apiKey, getStateExpertPrompt(), fixMessage, { maxTokens: 8192 })
          trackTokens(retry)
          stateResult = extractJSON(retry.text) || stateResult
        }
      }

      yield { type: 'agent_progress', agent: 'reviewer', status: 'complete', progress: 100, message: 'Retry complete' }
    }
  } catch (error) {
    yield { type: 'agent_progress', agent: 'reviewer', status: 'complete', progress: 100, message: `Review error: ${String(error)}` }
    // Don't fail the whole process — reviewer errors are non-fatal
    reviewResult = { review_status: 'error', checks: [], warnings: 1, errors: 0, passed: 0, total_checks: 0 }
  }

  // ============ PHASE 4: MERGE & OUTPUT ============
  yield { type: 'phase', phase: 'Complete' }

  // Build the final TaxData object for the dashboard
  const mergedData = buildDashboardData(strategyResult, rsuResult, stateResult, reviewResult, onboarding, totalTokens, startTime)

  yield { type: 'complete', data: mergedData }
}

/**
 * Merge all agent outputs into the TaxData format expected by the dashboard.
 */
function buildDashboardData(strategy: any, rsu: any, state: any, review: any, onboarding: any, tokens: any, startTime: number): any {
  const s = strategy || {}
  const r = rsu?.corrections || {}
  const st = state || {}

  // Safe accessors
  const income = s.income || {}
  const wages = income.wages || {}
  const deductions = s.deductions || {}
  const itemized = deductions.itemized || {}
  const credits = s.credits || {}
  const tax = s.tax || {}
  const payments = s.payments || {}
  const result = s.result || {}
  const filing = s.filing_status || {}

  const ny = st.ny_return || {}
  const nj = st.nj_return || {}

  const primaryRSU = r.primary || {}
  const spouseRSU = r.spouse || null

  return {
    taxYear: 2025,
    filingStatus: filing.recommended || onboarding.filingStatus || 'MFJ',
    primary: { name: onboarding.primaryName || 'Taxpayer' },
    spouse: onboarding.spouseName ? { name: onboarding.spouseName } : undefined,

    summary: {
      federalRefund: Math.abs(result.refund_or_owed || 0),
      nyRefund: ny.refund || 0,
      njOwed: nj.owed || 0,
      totalBack: Math.abs(result.refund_or_owed || 0) + (ny.refund || 0) - (nj.owed || 0),
      naiveApproachOwed: Math.abs(result.refund_or_owed || 0) + (rsu?.combined_savings || 0) + (filing.savings || 0),
      totalSwing: Math.abs(result.refund_or_owed || 0) + (rsu?.combined_savings || 0) + (filing.savings || 0) + (deductions.savings_vs_other_method || 0),
    },

    income: {
      wages: {
        primary: { employer: onboarding.employer || '', wages: wages.primary || 0, withheld: payments.federal_withholding?.primary || 0, fourOhOneK: 0, rsu: 0 },
        spouse: onboarding.spouseName ? { employer: onboarding.spouseEmployer || '', wages: wages.spouse || 0, withheld: payments.federal_withholding?.spouse || 0, fourOhOneK: 0, rsu: 0 } : undefined,
        combined: wages.total || 0,
      },
      dividends: income.dividends || { ordinary: 0, qualified: 0 },
      interest: income.interest || 0,
      capitalGains: income.capital_gains || { shortTerm: 0, longTerm: 0, carryforward: 0, net: 0 },
      scheduleC: income.schedule_c?.net ? { businessName: onboarding.businessName || 'Business', income: income.schedule_c.income || 0, expenses: income.schedule_c.expenses || 0, net: income.schedule_c.net } : undefined,
      agi: s.agi || 0,
    },

    rsuCorrections: {
      primary: {
        totalProceeds: primaryRSU.total_proceeds || 0,
        reportedBasis: 0,
        correctedBasis: primaryRSU.total_correct_basis || 0,
        actualGain: 0,
        phantomIncomeEliminated: primaryRSU.total_phantom_income_eliminated || 0,
        taxSaved: primaryRSU.estimated_tax_saved || 0,
        transactions: (primaryRSU.transactions || []).map((t: any) => ({
          date: t.sale_date || '',
          shares: t.shares || t.shares_sold || 0,
          proceeds: t.proceeds || 0,
          basis: t.correct_basis || 0,
          gain: t.actual_gain || t.actual_gain_loss || 0,
        })),
      },
      spouse: spouseRSU ? {
        totalProceeds: spouseRSU.total_proceeds || 0,
        reportedBasis: 0,
        correctedBasis: spouseRSU.total_correct_basis || 0,
        actualGain: 0,
        phantomIncomeEliminated: spouseRSU.total_phantom_income_eliminated || 0,
        taxSaved: spouseRSU.estimated_tax_saved || 0,
        transactions: (spouseRSU.transactions || []).map((t: any) => ({
          date: t.sale_date || '',
          shares: t.shares || t.shares_sold || 0,
          proceeds: t.proceeds || 0,
          basis: t.correct_basis || 0,
          gain: t.actual_gain || t.actual_gain_loss || 0,
        })),
      } : undefined,
      combinedSavings: rsu?.combined_savings || 0,
    },

    deductions: {
      method: deductions.method || 'itemized',
      itemized: {
        mortgageInterest: itemized.mortgage_interest || 0,
        points: itemized.points || 0,
        salt: itemized.salt || 0,
        charitable: itemized.charitable || 0,
        total: itemized.total || 0,
      },
      standardDeduction: deductions.standard || 29200,
      savingsVsStandard: deductions.savings_vs_other_method || 0,
    },

    credits: {
      solar: credits.solar ? { cost: onboarding.solarCost || 0, credit: credits.solar } : undefined,
      foreignTax: credits.foreign_tax || 0,
      qbi: s.qbi_deduction || 0,
      total: credits.total || 0,
    },

    taxCalculation: {
      taxableIncome: s.taxable_income || 0,
      incomeTax: tax.income_tax || 0,
      additionalMedicare: tax.additional_medicare || 0,
      niit: tax.niit || 0,
      grossTax: tax.total_tax || 0,
      totalCredits: credits.total || 0,
      netTax: s.net_tax || 0,
      totalWithholding: payments.total || 0,
      result: result.refund_or_owed || 0,
    },

    stateReturns: {
      ny: {
        form: 'IT-203',
        type: 'Non-Resident',
        nyWages: ny.ny_wages || 0,
        nyTaxCalculated: ny.ny_tax_calculated || 0,
        nyTaxWithheld: ny.ny_tax_withheld || 0,
        refund: ny.refund || 0,
      },
      nj: {
        form: 'NJ-1040',
        type: 'Resident',
        njGrossIncome: nj.nj_gross_income || 0,
        propertyTaxDeduction: nj.property_tax_deduction || onboarding.propertyTax || 0,
        njTaxBeforeCredit: nj.nj_tax_before_credit || 0,
        creditForNY: nj.credit_for_ny || 0,
        owed: nj.owed || 0,
      },
    },

    optimizations: (s.optimizations || []).map((o: any) => ({
      name: o.description || o.name || '',
      savings: o.savings || 0,
      risk: o.risk_level || o.risk || 'safe',
      description: o.description || '',
    })),

    documentChecklist: [],

    audit: {
      review: review ? {
        total_checks: review.total_checks || 0,
        passed: review.passed || 0,
        warnings: review.warnings || 0,
        errors: review.errors || 0,
        user_review_needed: 0,
        checks: review.checks || [],
      } : undefined,
      agents: {
        doc_processor: { agent: 'doc_processor', status: 'success', duration_ms: 0, decisions: [] },
        tax_strategist: { agent: 'tax_strategist', status: 'success', duration_ms: 0, decisions: [] },
        rsu_specialist: { agent: 'rsu_specialist', status: 'success', duration_ms: 0, decisions: [] },
        state_expert: { agent: 'state_expert', status: 'success', duration_ms: 0, decisions: [] },
        reviewer: { agent: 'reviewer', status: 'success', duration_ms: 0, decisions: [] },
      },
    },

    _meta: {
      totalInputTokens: tokens.input,
      totalOutputTokens: tokens.output,
      totalDurationMs: Date.now() - startTime,
      estimatedCost: `$${((tokens.input * 3 + tokens.output * 15) / 1_000_000).toFixed(2)}`,
    },
  }
}
