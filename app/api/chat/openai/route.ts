import { OpenAIStream, StreamingTextResponse } from "ai"
import OpenAI from "openai"
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs"

export const runtime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: {
      model: string
      temperature: number
    }
    messages: any[]
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "", // ✅ Usar la API KEY de Vercel
    })

    const response = await openai.chat.completions.create({
      model: chatSettings.model as ChatCompletionCreateParamsBase["model"],
      messages: messages,
      temperature: chatSettings.temperature,
      stream: true,
    })

    const stream = OpenAIStream(response)

    return new StreamingTextResponse(stream)
  } catch (error: any) {
    const errorMessage = error.message || "Error inesperado"
    const errorCode = error.status || 500

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
