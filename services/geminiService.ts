import { GoogleGenAI, Type } from "@google/genai";
import { Difficulty } from "../types";

// Ensure the API key is available from environment variables
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const textModel = "gemini-2.5-flash";
const imageModel = "gemini-2.5-flash-image";

const generateAndParseJson = async <T,>(prompt: string, schema: object): Promise<T> => {
    const response = await ai.models.generateContent({
        model: textModel,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema,
        },
    });

    if (!response.text) {
        throw new Error("Received an empty response from the API.");
    }
    
    try {
        const cleanJson = response.text.replace(/^```json\n|```$/g, '').trim();
        return JSON.parse(cleanJson) as T;
    } catch (error) {
        console.error("Failed to parse JSON from response:", response.text);
        throw new Error("Invalid JSON format received from the API.");
    }
};

export const generateBookTitle = async (category: string, difficulty: Difficulty): Promise<string> => {
    const prompt = `Generate a single, creative and fun book title for a children's dot-to-dot activity book. The theme is "${category}" and the difficulty level is "${difficulty}". Return the response as a JSON object with a single key "title".`;
    const { title } = await generateAndParseJson<{ title: string }>(prompt, {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
        },
        required: ['title'],
    });
    return title;
};

export const generateBookDescription = async (category: string): Promise<string> => {
    const prompt = `Write a captivating and kid-friendly book description for the back cover of a dot-to-dot activity book. The theme is "${category}". The description should be around 100-120 words and entice parents to buy it. Mention the fun and educational benefits of connecting the dots. Return the response as a JSON object with a single key "description".`;
    const { description } = await generateAndParseJson<{ description: string }>(prompt, {
        type: Type.OBJECT,
        properties: {
            description: { type: Type.STRING },
        },
        required: ['description'],
    });
    return description;
};

export const generateImageIdeas = async (category: string, count: number): Promise<string[]> => {
    const prompt = `Generate a list of ${count} specific, single-object ideas for dot-to-dot images within the category "${category}". Each idea should be a simple, recognizable noun. Return as a JSON object with a key "ideas" containing an array of strings.`;
    const { ideas } = await generateAndParseJson<{ ideas: string[] }>(prompt, {
        type: Type.OBJECT,
        properties: {
            ideas: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            },
        },
        required: ['ideas'],
    });
    return ideas;
}

const generateImageFromApi = async (prompt: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: imageModel,
        contents: { parts: [{ text: prompt }] },
    });

    const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (imagePart && imagePart.inlineData) {
        return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
    }

    console.error("Image generation failed. Full API response:", JSON.stringify(response, null, 2));

    let errorMessage = "No image data found in API response.";
    const textResponse = response.text;

    if (textResponse && textResponse.trim()) {
        errorMessage = `Image generation failed. The model responded with: "${textResponse.trim()}"`;
    } else if (response.promptFeedback?.blockReason) {
        errorMessage = `Image generation blocked. Reason: ${response.promptFeedback.blockReason}.`;
    } else if (response.candidates?.[0]?.finishReason && response.candidates[0].finishReason !== 'STOP') {
        errorMessage = `Image generation failed with finish reason: ${response.candidates[0].finishReason}.`;
    }

    throw new Error(errorMessage);
};


export const generateCoverImage = async (category: string): Promise<string> => {
    const prompt = `A vibrant and colorful book cover illustration for a children's dot-to-dot activity book about "${category}". The style should be joyful, friendly, and eye-catching for kids. Feature a cute central cartoon character related to the theme. Clean, simple background. No text on the image.`;
    return generateImageFromApi(prompt);
};

const getDifficultyInstruction = (difficulty: Difficulty): string => {
    switch (difficulty) {
        case 'easy':
            return 'The puzzle should have around 15-25 numbered dots.';
        case 'medium':
            return 'The puzzle should have around 30-50 numbered dots.';
        case 'hard':
            return 'The puzzle should have around 55-75 numbered dots.';
        case 'expert':
            return 'The puzzle should be complex and detailed, with around 80-100 numbered dots.';
        default:
            return 'The puzzle should have around 30-50 numbered dots.';
    }
}

export const generateDotToDotImage = async (objectName: string, difficulty: Difficulty): Promise<string> => {
    const difficultyInstruction = getDifficultyInstruction(difficulty);
    // Rephrased prompt to be more conversational and less like a technical spec,
    // which can help avoid silent failures where the model returns no image data.
    const prompt = `Generate a connect-the-dots puzzle for a children's activity book. The subject is a single, cute cartoon-style ${objectName}.
The image must be simple black and white line art on a completely white background.
The puzzle must have clear, black, numbered dots starting from 1. ${difficultyInstruction}.
The final image should only contain the centered dot-to-dot puzzle, with no extra text, colors, or background elements.`;
    return generateImageFromApi(prompt);
};