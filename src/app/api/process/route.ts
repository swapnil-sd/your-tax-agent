import { NextRequest } from 'next/server'
import { orchestrate } from '@/lib/orchestrator'
import { processUploadedFiles } from '@/lib/pdf-reader'

export const maxDuration = 300 // 5 minute timeout for Vercel

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const apiKey = formData.get('apiKey') as string
  const onboarding = JSON.parse(formData.get('onboarding') as string)
  const files = formData.getAll('files') as File[]

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key required' }), { status: 400 })
  }

  if (files.length === 0) {
    return new Response(JSON.stringify({ error: 'No files uploaded' }), { status: 400 })
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      function send(data: object) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      try {
        // Extract text from PDFs
        send({ type: 'agent_progress', agent: 'doc_processor', status: 'running', progress: 5, message: 'Extracting text from PDFs...' })
        const documents = await processUploadedFiles(files)
        send({ type: 'agent_progress', agent: 'doc_processor', status: 'running', progress: 15, message: `Extracted text from ${documents.length} files` })

        // Run the orchestrator
        for await (const event of orchestrate(documents, onboarding, apiKey)) {
          send(event)
        }
      } catch (error) {
        send({ type: 'error', message: `Processing error: ${String(error)}` })
      }

      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
