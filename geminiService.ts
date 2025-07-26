
import { GoogleGenAI, Type } from "@google/genai";
import type { TopicResponse } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        topic: { type: Type.STRING, description: "The main topic that was researched." },
        summary: { type: Type.STRING, description: "A concise, one-paragraph summary of the topic suitable for an undergraduate student." },
        keyConcepts: {
            type: Type.ARRAY,
            description: "A list of 3-5 core concepts related to the topic.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "The name of the key concept." },
                    description: { type: Type.STRING, description: "A detailed explanation of the concept." },
                },
                required: ["name", "description"]
            }
        },
        researchQuestions: {
            type: Type.ARRAY,
            description: "A list of 3-4 potential research questions or current areas of investigation related to the topic, suitable for graduate students.",
            items: { type: Type.STRING }
        },
        relatedTopics: {
            type: Type.ARRAY,
            description: "A list of 3-4 related topics for further exploration.",
            items: { type: Type.STRING }
        }
    },
    required: ["topic", "summary", "keyConcepts", "researchQuestions", "relatedTopics"]
};

export const exploreTopic = async (topic: string): Promise<TopicResponse> => {
    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Please provide a detailed breakdown of the microbiology topic: "${topic}"`,
            config: {
                systemInstruction: "You are an expert academic assistant specializing in microbiology. Your goal is to provide clear, structured, and in-depth information on microbiology topics for university students and researchers. Always adhere to the provided JSON schema precisely.",
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });

        const jsonText = result.text.trim();
        const parsedData = JSON.parse(jsonText);
        return parsedData as TopicResponse;

    } catch (error) {
        console.error("Error fetching or parsing data from Gemini API:", error);
        if (error instanceof Error && error.message.includes('429')) {
             throw new Error("API rate limit exceeded. Please wait a moment before trying again.");
        }
        throw new Error("Failed to get a valid response from the AI. It might be experiencing high traffic. Please try again later.");
    }
};
