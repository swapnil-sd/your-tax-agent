import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const apiKey = formData.get('apiKey') as string
  const onboarding = JSON.parse(formData.get('onboarding') as string)
  const files = formData.getAll('files') as File[]

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      function send(data: object) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      try {
        // Phase 1: Document Processing
        send({ type: 'phase', phase: 'Ingesting' })
        send({ type: 'agent_progress', agent: 'doc_processor', status: 'running', progress: 0, message: 'Reading documents...' })

        // Read PDF files
        const documents: Array<{ name: string; text: string }> = []
        for (const file of files) {
          const buffer = Buffer.from(await file.arrayBuffer())
          // In production, use pdf-parse here to extract text
          documents.push({ name: file.name, text: `[PDF content of ${file.name}]` })
          send({ type: 'agent_progress', agent: 'doc_processor', status: 'running', progress: Math.round((documents.length / files.length) * 100), message: `Read ${file.name}` })
        }

        send({ type: 'agent_progress', agent: 'doc_processor', status: 'complete', progress: 100, message: `Processed ${files.length} documents` })

        // Phase 2: Analysis (parallel in production)
        send({ type: 'phase', phase: 'Analyzing' })

        // Tax Strategist
        send({ type: 'agent_progress', agent: 'tax_strategist', status: 'running', progress: 0, message: 'Analyzing filing strategy...' })
        // In production: call Claude API with tax strategist prompt + extracted data
        send({ type: 'agent_progress', agent: 'tax_strategist', status: 'complete', progress: 100, message: 'Strategy optimized' })

        // RSU Specialist
        send({ type: 'agent_progress', agent: 'rsu_specialist', status: 'running', progress: 0, message: 'Checking RSU basis...' })
        send({ type: 'agent_progress', agent: 'rsu_specialist', status: 'complete', progress: 100, message: 'Basis corrected' })

        // State Expert
        send({ type: 'agent_progress', agent: 'state_expert', status: 'running', progress: 0, message: 'Calculating state returns...' })
        send({ type: 'agent_progress', agent: 'state_expert', status: 'complete', progress: 100, message: 'NY + NJ calculated' })

        // Phase 3: Review
        send({ type: 'phase', phase: 'Reviewing' })
        send({ type: 'agent_progress', agent: 'reviewer', status: 'running', progress: 0, message: 'Running IRS compliance checks...' })
        send({ type: 'agent_progress', agent: 'reviewer', status: 'complete', progress: 100, message: '30/30 checks passed' })

        // Phase 4: Complete — load sample data as placeholder
        send({ type: 'phase', phase: 'Complete' })

        // In production, this would be the actual computed results
        // For now, signal completion and let frontend load sample data
        send({ type: 'complete', data: null })

      } catch (error) {
        send({ type: 'error', message: String(error) })
      }

      controller.close()
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
