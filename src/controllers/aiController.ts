import axios from "axios"
import { Request, Response } from "express"
import dotenv from "dotenv"
dotenv.config()

const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string

export const aiGeneratedContent = async (req: Request, res: Response) => {
  try {
    const { text, maxToken } = req.body

    // check text null send 400
    const aiResponse = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            parts: [{ text }]
          }
        ],
        generationConfig: {
          maxOutputTokens: maxToken || 150
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": GEMINI_API_KEY
        }
      }
    )

    const genratedContent =
      aiResponse.data?.candidates?.[0]?.content?.[0]?.text ||
      aiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No data"

    console.log(res)

    res.status(200).json({
      data: genratedContent
    })
  } catch (err) {
    res.status(500).json({ message: "AI genration failed" })
  }
}