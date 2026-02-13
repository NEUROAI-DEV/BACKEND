/**
 * Split text into chunks suitable for RAG indexing.
 * Tries to split on paragraphs first, then by maxChunkSize with optional overlap.
 */
export function chunkText(
  text: string,
  maxChunkSize: number = 600,
  overlapChars: number = 80
): string[] {
  const normalized = text.replace(/\r\n/g, '\n').trim()
  if (!normalized) return []

  const paragraphs = normalized.split(/\n\s*\n/)
  const chunks: string[] = []

  for (const para of paragraphs) {
    const trimmed = para.trim()
    if (!trimmed) continue

    if (trimmed.length <= maxChunkSize) {
      chunks.push(trimmed)
      continue
    }

    // Split long paragraph by sentences or fixed size
    const sentences = trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [trimmed]
    let current = ''

    for (const sent of sentences) {
      if (current.length + sent.length + 1 <= maxChunkSize) {
        current = current ? `${current} ${sent}` : sent
      } else {
        if (current) {
          chunks.push(current)
          if (overlapChars > 0 && current.length >= overlapChars) {
            const start = current.length - overlapChars
            current = current.slice(start) + ' ' + sent
          } else {
            current = sent
          }
        } else {
          chunks.push(sent)
          current = ''
        }
      }
    }
    if (current.trim()) chunks.push(current.trim())
  }

  return chunks.filter((c) => c.length > 0)
}
