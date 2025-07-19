import { type NextRequest, NextResponse } from "next/server"
import { AssemblyAI } from "assemblyai"

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

    // Convert File to buffer
    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload audio to AssemblyAI
    const uploadUrl = await client.files.upload(buffer)

    // Transcribe the audio
    const transcript = await client.transcripts.transcribe({
      audio: uploadUrl,
      speech_model: "best",
    })

    if (transcript.status === "error") {
      return NextResponse.json({ error: "Transcription failed" }, { status: 500 })
    }

    return NextResponse.json({
      transcript: transcript.text,
      confidence: transcript.confidence,
    })
  } catch (error) {
    console.error("Transcription error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
