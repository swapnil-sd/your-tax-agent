'use client'
import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTaxStore } from '@/lib/store'
import { Upload, FileText, X, ArrowRight, AlertCircle } from 'lucide-react'

const docTypes: Record<string, string> = {
  'w2': 'W-2',
  'w-2': 'W-2',
  'wage': 'W-2',
  '1099-b': '1099-B',
  '1099b': '1099-B',
  'broker': '1099-B',
  '1099-div': '1099-DIV',
  '1099div': '1099-DIV',
  'dividend': '1099-DIV',
  '1099-int': '1099-INT',
  '1099int': '1099-INT',
  'interest': '1099-INT',
  '1098': 'Form 1098',
  'mortgage': 'Form 1098',
  'rsu': 'RSU Vesting',
  'vesting': 'RSU Vesting',
  'stock plan': 'RSU Vesting',
  'fidelity': 'Brokerage 1099',
  'robinhood': 'Brokerage 1099',
  'betterment': 'Brokerage 1099',
  'titan': 'Brokerage 1099',
  'schwab': 'Brokerage 1099',
  'solar': 'Solar Invoice',
}

function classifyFile(name: string): string {
  const lower = name.toLowerCase()
  for (const [keyword, type] of Object.entries(docTypes)) {
    if (lower.includes(keyword)) return type
  }
  return 'Tax Document'
}

export default function UploadPage() {
  const router = useRouter()
  const { files, addFiles, removeFile, onboarding } = useTaxStore()
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const newFiles = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf')
    addFiles(newFiles)
  }, [addFiles])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(f => f.type === 'application/pdf')
      addFiles(newFiles)
    }
  }, [addFiles])

  const classified = files.map(f => ({ file: f, type: classifyFile(f.name) }))
  const types = [...new Set(classified.map(c => c.type))]

  // Check for expected docs
  const hasW2 = classified.some(c => c.type === 'W-2')
  const hasRSU = onboarding.rsuBroker && classified.some(c => c.type === 'RSU Vesting')
  const has1098 = classified.some(c => c.type === 'Form 1098')
  const missing: string[] = []
  if (!hasW2) missing.push('W-2')
  if (onboarding.rsuBroker && !hasRSU) missing.push('RSU Vesting Records')
  if (onboarding.propertyTax > 0 && !has1098) missing.push('Form 1098 (Mortgage)')

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Upload Your Tax Documents</h1>
        <p className="text-gray-500 mb-8">Drag and drop your PDFs. We&apos;ll classify them automatically.</p>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition cursor-pointer
            ${dragOver ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400 bg-white'}`}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <Upload className={`w-10 h-10 mx-auto mb-4 ${dragOver ? 'text-green-500' : 'text-gray-400'}`} />
          <p className="font-medium">{dragOver ? 'Drop files here' : 'Drag & drop PDFs here'}</p>
          <p className="text-sm text-gray-400 mt-1">or click to browse</p>
          <input id="file-input" type="file" accept=".pdf" multiple onChange={handleFileInput} className="hidden" />
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="mt-6 bg-white rounded-xl border p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold">{files.length} document{files.length > 1 ? 's' : ''} uploaded</h2>
              <div className="flex gap-2 text-xs">
                {types.map(t => (
                  <span key={t} className="bg-green-50 text-green-700 px-2 py-1 rounded-full">{t}</span>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              {classified.map((c, i) => (
                <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{c.file.name}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{c.type}</span>
                  </div>
                  <button onClick={() => removeFile(i)} className="text-gray-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Missing docs warning */}
        {missing.length > 0 && files.length > 0 && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Missing documents</p>
              <p className="text-sm text-yellow-700 mt-1">
                Based on your profile, you may be missing: {missing.join(', ')}
              </p>
            </div>
          </div>
        )}

        {/* Continue */}
        <button
          onClick={() => router.push('/processing')}
          disabled={files.length === 0}
          className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          Analyze My Taxes <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
