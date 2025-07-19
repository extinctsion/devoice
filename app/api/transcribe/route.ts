import { AssemblyAI } from "assemblyai"
import { type NextRequest, NextResponse } from "next/server"

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    console.log("Transcription request received")

    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      console.error("No audio file provided")
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    console.log("Audio file details:", {
      name: audioFile.name,
      size: audioFile.size,
      type: audioFile.type,
    })

    // Check if file is too small (likely empty)
    if (audioFile.size < 1000) {
      console.error("Audio file too small:", audioFile.size)
      return NextResponse.json({ error: "Audio file is too small or empty" }, { status: 400 })
    }

    // Convert File to Buffer
    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    console.log("Buffer size:", buffer.length)

    // Upload audio to AssemblyAI first
    const uploadUrl = await client.files.upload(buffer)
    console.log("Audio uploaded to:", uploadUrl)

    // Transcribe the audio using the uploaded URL
    const transcript = await client.transcripts.transcribe({
      audio_url: uploadUrl,
      speech_model: "best",
      language_detection: true,
      punctuate: true,
      format_text: true,
    })

    console.log("Transcription status:", transcript.status)

    if (transcript.status === "error") {
      console.error("AssemblyAI transcription error:", transcript.error)
      throw new Error(transcript.error || "Transcription failed")
    }

    // Wait for completion if still processing
    if (transcript.status === "processing" || transcript.status === "queued") {
      console.log("Waiting for transcription to complete...")

      // Poll for completion (max 30 seconds)
      let attempts = 0
      const maxAttempts = 30

      while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const updatedTranscript = await client.transcripts.get(transcript.id)
        console.log(`Attempt ${attempts + 1}: Status is ${updatedTranscript.status}`)

        if (updatedTranscript.status === "completed") {
          return NextResponse.json({
            transcript: updatedTranscript.text || "No speech detected",
            confidence: updatedTranscript.confidence || 0,
          })
        }

        if (updatedTranscript.status === "error") {
          console.error("AssemblyAI error during processing:", updatedTranscript.error)
          throw new Error(updatedTranscript.error || "Transcription failed during processing")
        }

        attempts++
      }

      throw new Error("Transcription timed out")
    }

    return NextResponse.json({
      transcript: transcript.text || "No speech detected",
      confidence: transcript.confidence || 0,
    })
  } catch (error) {
    console.error("Detailed transcription error:", error)

    // Provide more specific error messages
    let errorMessage = "Failed to transcribe audio"

    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        errorMessage = "Invalid API key configuration"
      } else if (error.message.includes("network") || error.message.includes("fetch")) {
        errorMessage = "Network error - please check your connection"
      } else if (error.message.includes("format") || error.message.includes("codec")) {
        errorMessage = "Unsupported audio format"
      } else {
        errorMessage = error.message
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
