import { AssemblyAI } from "assemblyai"
import { type NextRequest, NextResponse } from "next/server"

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    // Convert File to Buffer
    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Create a streaming transcription
    const transcript = await client.transcripts.transcribe({
      audio: buffer,
      speech_model: "best",
      language_detection: true,
    })

    if (transcript.status === "error") {
      throw new Error(transcript.error || "Transcription failed")
    }

    return NextResponse.json({
      transcript: transcript.text || "No speech detected",
      confidence: transcript.confidence || 0,
    })
  } catch (error) {
    console.error("Stream transcription error:", error)
    return NextResponse.json({ error: "Failed to transcribe audio stream" }, { status: 500 })
  }
}
