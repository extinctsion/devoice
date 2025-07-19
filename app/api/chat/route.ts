import { NextResponse } from "next/server"
import { generateText } from "ai"
import { cohere } from "@ai-sdk/cohere"

/**
 * POST /api/chat
 * Body: { "message": string }
 * Returns: { "response": string }
 */
export async function POST(req: Request) {
  try {
    const { message } = (await req.json()) as { message?: string }

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 })
    }

    // Using Cohere API instead of OpenAI
    const { text } = await generateText({
      model: cohere("command-r-plus"),
      prompt: message,
      system:
        "You are DevVoice, an AI coding assistant that helps developers with programming questions. " +
        "Provide clear, concise, and helpful answers about coding, debugging, algorithms, and software development. " +
        "Keep responses conversational and under 200 words since they will be spoken aloud. " +
        "Include code examples when relevant, but keep them brief and well-explained. " +
        "Focus on practical, actionable advice that developers can immediately use.",
      maxTokens: 300,
      temperature: 0.7,
    })

    return NextResponse.json({ response: text })
  } catch (err: unknown) {
    console.error("[/api/chat] Cohere error:", err)
    return NextResponse.json(
      {
        error: "Cohere request failed. Please check the API configuration and try again.",
      },
      { status: 500 },
    )
  }
}
