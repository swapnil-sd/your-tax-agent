import Anthropic from '@anthropic-ai/sdk'

export interface AgentResponse {
  text: string
  inputTokens: number
  outputTokens: number
}

export async function callClaude(
  apiKey: string,
  systemPrompt: string,
  userMessage: string,
  options?: { model?: string; maxTokens?: number }
): Promise<AgentResponse> {
  const client = new Anthropic({ apiKey })

  const response = await client.messages.create({
    model: options?.model || 'claude-sonnet-4-20250514',
    max_tokens: options?.maxTokens || 8192,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  })

  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map(block => block.text)
    .join('\n')

  return {
    text,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
  }
}

/**
 * Extract JSON from Claude's response text.
 * Handles responses that include markdown code blocks or extra text around JSON.
 */
export function extractJSON<T>(text: string): T | null {
  // Try direct parse first
  try {
    return JSON.parse(text) as T
  } catch {}

  // Try extracting from code block
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1]) as T
    } catch {}
  }

  // Try finding first { to last }
  const firstBrace = text.indexOf('{')
  const lastBrace = text.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(text.slice(firstBrace, lastBrace + 1)) as T
    } catch {}
  }

  return null
}
