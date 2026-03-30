export interface TaxData {
  taxYear: number
  filingStatus: string
  primary: { name: string }
  spouse?: { name: string }
  summary: {
    federalRefund: number
    nyRefund: number
    njOwed: number
    totalBack: number
    naiveApproachOwed: number
    totalSwing: number
  }
  income: {
    wages: {
      primary: { employer: string; wages: number; withheld: number; fourOhOneK: number; rsu: number }
      spouse?: { employer: string; wages: number; withheld: number; fourOhOneK: number; rsu: number }
      combined: number
    }
    dividends: { ordinary: number; qualified: number }
    interest: number
    capitalGains: { shortTerm: number; longTerm: number; carryforward: number; net: number }
    scheduleC?: { businessName: string; income: number; expenses: number; net: number }
    agi: number
  }
  rsuCorrections: {
    primary: RSUCorrection
    spouse?: RSUCorrection
    combinedSavings: number
  }
  deductions: {
    method: string
    itemized: { mortgageInterest: number; points: number; salt: number; charitable: number; total: number }
    standardDeduction: number
    savingsVsStandard: number
  }
  credits: {
    solar?: { cost: number; credit: number }
    foreignTax: number
    qbi: number
    total: number
  }
  taxCalculation: {
    taxableIncome: number
    incomeTax: number
    additionalMedicare: number
    niit: number
    grossTax: number
    totalCredits: number
    netTax: number
    totalWithholding: number
    result: number
  }
  stateReturns: {
    ny: { form: string; type: string; nyWages: number; nyTaxCalculated: number; nyTaxWithheld: number; refund: number }
    nj: { form: string; type: string; njGrossIncome: number; propertyTaxDeduction: number; njTaxBeforeCredit: number; creditForNY: number; owed: number }
  }
  optimizations: Optimization[]
  documentChecklist: DocumentItem[]
  audit?: AuditData
}

export interface AuditData {
  review?: {
    total_checks: number
    passed: number
    warnings: number
    errors: number
    user_review_needed: number
    checks: AuditCheck[]
  }
  agents?: Record<string, AgentLog>
}

export interface AuditCheck {
  id: number
  name: string
  category: string
  status: 'pass' | 'pass_after_retry' | 'warning' | 'error' | 'user_review_needed' | 'skipped'
  details?: string
  expected?: number
  found?: number
  responsible_agent?: string
}

export interface AgentLog {
  agent: string
  status: string
  duration_ms?: number
  retry_count?: number
  decisions?: Array<{ decision: string; reason: string }>
  warnings?: string[]
  errors?: string[]
}

export interface RSUCorrection {
  totalProceeds: number
  reportedBasis: number
  correctedBasis: number
  actualGain: number
  phantomIncomeEliminated: number
  taxSaved: number
  transactions: Array<{
    date: string
    shares: number
    proceeds: number
    basis: number
    gain: number
  }>
}

export interface Optimization {
  name: string
  savings: number
  risk: 'safe' | 'moderate' | 'aggressive'
  description: string
}

export interface DocumentItem {
  name: string
  status: 'complete' | 'needed' | 'missing'
}
