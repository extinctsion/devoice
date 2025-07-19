import type { NextRequest } from "next/server"
import { AssemblyAI } from "assemblyai"

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY!,
})

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get("sessionId")

  if (!sessionId) {
    return new Response("Session ID required", { status: 400 })
  }

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      // Create streaming transcriber
      const transcriber = client.streaming.transcriber({
        sampleRate: 16000,
        formatTurns: true,
      })

      transcriber.on("open", ({ id }) => {
        const data = encoder.encode(`data: ${JSON.stringify({ type: "session_opened", sessionId: id })}\n\n`)
        controller.enqueue(data)
      })

      transcriber.on("turn", (turn) => {
        if (turn.transcript) {
          const data = encoder.encode(
            `data: ${JSON.stringify({
              type: "transcript",
              text: turn.transcript,
              confidence: turn.confidence,
            })}\n\n`,
          )
          controller.enqueue(data)
        }
      })

      transcriber.on("error", (error) => {
        const data = encoder.encode(`data: ${JSON.stringify({ type: "error", error: error.message })}\n\n`)
        controller.enqueue(data)
      })

      transcriber.on("close", () => {
        const data = encoder.encode(`data: ${JSON.stringify({ type: "session_closed" })}\n\n`)
        controller.enqueue(data)
        controller.close()
      })

      // Connect to AssemblyAI
      transcriber
        .connect()
        .catch((error) => {
          console.error("Failed to connect to AssemblyAI:", error)
          controller.error(error)
        })

      // Store transcriber reference for cleanup
      ;(request as any).transcriber = transcriber
    },
    cancel() {
      if ((request as any).transcriber) {
        ;(request as any).transcriber.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
