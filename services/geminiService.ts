import { GoogleGenAI } from "@google/genai";
import type { BriefingData, Source } from '../types';

const getFormattedDateTime = (): { date: string, time: string } => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? '오후' : '오전';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    const dateStr = `${year}년 ${month}월 ${day}일`;
    const timeStr = `${ampm} ${hours}시 ${minutes.toString().padStart(2, '0')}분`;
    
    return { date: dateStr, time: timeStr };
};

export const generateBriefing = async (): Promise<BriefingData> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const { date, time } = getFormattedDateTime();

    const prompt = `
      You are an expert radio news scriptwriter specializing in the South Korean startup ecosystem. Your task is to generate a daily news briefing script for entrepreneurs, written to be read aloud by a news anchor.

      Follow these instructions exactly:
      1. Use Google Search to find at least 5 of the most important and recent startup-related news and press releases from major South Korean internet newspapers published in the last 24 hours.
      2. Focus on news that is critical for founders and entrepreneurs to know, such as funding rounds, new government policies, major product launches, market trends, and M&A activities.
      3. Write the output as a radio news briefing script. The tone should be professional, clear, and engaging, as if it's being broadcast. The script should be easy to read aloud.
      4. Start the script with the exact phrase: "${date} ${time} 창업 뉴스 브리핑입니다."
      5. For each news item, present it as a separate segment. Summarize the key points in a conversational, narrative style. At the end of each news summary, mention the source naturally, for example: "이 소식은 전자신문에서 보도했습니다." or "자세한 내용은 ZDNet Korea 기사를 참고하시기 바랍니다."
      6. End the entire script with the exact phrase: "오늘 뉴스는 [출처표시] 제공입니다." where [출처표시] is a list of the primary news sources you used (e.g., "전자신문, ZDNet Korea").

      Generate the radio script now.
    `;

    const response = await ai.models.generateContent({
       model: "gemini-2.5-flash",
       contents: prompt,
       config: {
         tools: [{googleSearch: {}}],
       },
    });
    
    const briefingText = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // FIX: The .reduce<Source[]> call was causing a TypeScript error because `groundingChunks.filter(...)` can resolve to `any`.
    // The fix is to remove the generic type argument and type the initial value for `reduce` instead, allowing for proper type inference.
    const sources = groundingChunks
        .filter((chunk): chunk is Source => chunk && 'web' in chunk && chunk.web.uri !== '' && chunk.web.title !== '')
        .reduce((acc, current) => {
            // Deduplicate sources based on URI
            if (!acc.some(item => item.web.uri === current.web.uri)) {
                acc.push(current);
            }
            return acc;
        }, [] as Source[]);

    if (!briefingText) {
      throw new Error("API returned an empty response.");
    }

    return { briefing: briefingText, sources };

  } catch (error) {
    console.error("Error generating briefing:", error);
    if (error instanceof Error) {
        return Promise.reject(new Error(`Failed to generate briefing: ${error.message}`));
    }
    return Promise.reject(new Error("An unknown error occurred while generating the briefing."));
  }
};