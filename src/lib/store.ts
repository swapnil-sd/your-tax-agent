import { create } from 'zustand'
import { TaxData } from './types'

interface TaxStore {
  // API key
  apiKey: string
  setApiKey: (key: string) => void

  // Onboarding
  onboarding: {
    filingStatus: string
    maritalStatus: string
    primaryName: string
    spouseName: string
    employer: string
    spouseEmployer: string
    rsuBroker: string
    residentState: string
    workState: string
    dependents: string
    hasSideBusiness: boolean
    businessName: string
    businessExpenses: number
    hasSolar: boolean
    solarCost: number
    charitableDonations: number
    propertyTax: number
    priorYearCarryforward: number
  }
  setOnboarding: (data: Partial<TaxStore['onboarding']>) => void

  // Uploaded files
  files: File[]
  addFiles: (files: File[]) => void
  removeFile: (index: number) => void

  // Processing state
  processingStatus: 'idle' | 'running' | 'complete' | 'error'
  agentProgress: Record<string, { status: string; progress: number; message: string }>
  setProcessingStatus: (status: TaxStore['processingStatus']) => void
  updateAgentProgress: (agent: string, data: { status: string; progress: number; message: string }) => void

  // Results
  results: TaxData | null
  setResults: (data: TaxData) => void

  // Reset
  reset: () => void
}

const defaultOnboarding = {
  filingStatus: 'optimize',
  maritalStatus: '',
  primaryName: '',
  spouseName: '',
  employer: '',
  spouseEmployer: '',
  rsuBroker: 'Fidelity',
  residentState: 'NJ',
  workState: 'NY',
  dependents: '',
  hasSideBusiness: false,
  businessName: '',
  businessExpenses: 0,
  hasSolar: false,
  solarCost: 0,
  charitableDonations: 0,
  propertyTax: 0,
  priorYearCarryforward: 0,
}

export const useTaxStore = create<TaxStore>((set) => ({
  apiKey: typeof window !== 'undefined' ? localStorage.getItem('anthropic_api_key') || '' : '',
  setApiKey: (key) => {
    if (typeof window !== 'undefined') localStorage.setItem('anthropic_api_key', key)
    set({ apiKey: key })
  },

  onboarding: defaultOnboarding,
  setOnboarding: (data) => set((s) => ({ onboarding: { ...s.onboarding, ...data } })),

  files: [],
  addFiles: (files) => set((s) => ({ files: [...s.files, ...files] })),
  removeFile: (index) => set((s) => ({ files: s.files.filter((_, i) => i !== index) })),

  processingStatus: 'idle',
  agentProgress: {},
  setProcessingStatus: (status) => set({ processingStatus: status }),
  updateAgentProgress: (agent, data) => set((s) => ({ agentProgress: { ...s.agentProgress, [agent]: data } })),

  results: null,
  setResults: (data) => set({ results: data }),

  reset: () => set({ files: [], processingStatus: 'idle', agentProgress: {}, results: null, onboarding: defaultOnboarding }),
}))
