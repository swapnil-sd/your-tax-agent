/**
 * PDF text extraction for tax documents.
 * Uses pdf-parse to extract text content from uploaded PDF files.
 */

export async function extractPDFText(buffer: Buffer, filename: string): Promise<string> {
  try {
    // Dynamic import to avoid SSR issues
    const pdfParse = (await import('pdf-parse')).default
    const data = await pdfParse(buffer)
    return data.text
  } catch (error) {
    // If pdf-parse fails, return a placeholder with the filename
    // The Claude API can still work with limited info
    console.error(`Failed to parse PDF ${filename}:`, error)
    return `[Could not extract text from ${filename}. Please ensure this is a valid PDF.]`
  }
}

/**
 * Process multiple uploaded files into text documents.
 */
export async function processUploadedFiles(
  files: File[]
): Promise<Array<{ name: string; text: string; size: number }>> {
  const results = []

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer())
    const text = await extractPDFText(buffer, file.name)
    results.push({
      name: file.name,
      text,
      size: file.size,
    })
  }

  return results
}
