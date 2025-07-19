import { generateText } from "ai"
import { cohere } from "@ai-sdk/cohere"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: cohere("command-r-plus"),
      system: `You are DevVoice, an AI-powered coding assistant that helps developers solve problems through voice interaction. You should:

1. Provide clear, concise explanations for coding questions
2. Give practical examples and code snippets when relevant
3. Help debug errors and explain error messages
4. Suggest best practices and optimizations
5. Be conversational and helpful, as you're responding to voice queries
6. Keep responses focused and not too lengthy since they'll be spoken aloud
7. Format code examples clearly with proper syntax
8. Explain complex concepts in simple terms

Remember: Your responses will be converted to speech, so avoid overly complex formatting and keep explanations clear and spoken-friendly.`,
      prompt: message,
      maxTokens: 500,
      temperature: 0.7,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
