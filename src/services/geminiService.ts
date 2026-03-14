import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface MusicStyleParams {
  title: string;
  genre?: string;
  moods?: string[];
  instruments?: string[];
  tempos?: string[];
  duration?: string;
}

export async function generateMusicStyle(params: MusicStyleParams): Promise<string> {
  const { title, genre, moods, instruments, tempos, duration } = params;

  const prompt = `
    Create a highly detailed "Music Style Prompt" for a Spanish instrumental piece titled "${title}".
    
    Context:
    ${genre ? `- Genre: ${genre}` : ""}
    ${moods && moods.length > 0 ? `- Moods: ${moods.join(", ")}` : ""}
    ${instruments && instruments.length > 0 ? `- Instruments: ${instruments.join(", ")}` : ""}
    ${tempos && tempos.length > 0 ? `- Tempos: ${tempos.join(", ")}` : ""}
    ${duration ? `- Duration: ${duration}` : ""}
    
    This prompt is intended to be used as a technical specification for a music producer or an AI music generation tool.
    
    **CRITICAL: The total length of your response MUST NOT exceed 470 characters.** Be extremely concise. Use bullet points and avoid fluff.
    
    Please provide:
    1. **Style Prompt Summary**: A concise 2-3 sentence prompt.
    2. **Technical Breakdown**: Details on rhythm (compás), scale/mode (e.g., Phrygian dominant), and harmonic progression.
    3. **Instrumentation & Performance**: Specific instructions for the ${instruments?.join(", ") || "Spanish instruments"}.
    4. **Atmospheric Cues**: Keywords for the mood and spatial qualities.
    
    Format the response clearly using Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
    });

    return response.text || "Failed to generate music style.";
  } catch (error) {
    console.error("Error generating music style:", error);
    throw new Error("Failed to connect to the AI service. Please check your API key.");
  }
}
