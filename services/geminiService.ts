import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const STYLE_PROMPT_BASE = "A stylized digital portrait in the artistic style of WLOP, eggylicky, and annteya. Cinematic lighting, expressive, rich color texture.";

/**
 * Generates an image from a text prompt using the Imagen model.
 * @param prompt The text prompt to generate an image from.
 * @returns A promise that resolves to the base64 encoded image string.
 */
export const generateImageFromText = async (prompt: string): Promise<string> => {
    const fullPrompt = `${STYLE_PROMPT_BASE} ${prompt}`;
    
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: fullPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("No image was generated.");
    }

    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return base64ImageBytes;
};

/**
 * Transforms an existing image based on a text prompt.
 * @param base64ImageData The base64 encoded string of the image to transform.
 * @param mimeType The MIME type of the image.
 * @param prompt The text prompt describing the transformation.
 * @returns A promise that resolves to the base64 encoded string of the transformed image.
 */
export const transformImage = async (
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  const fullPrompt = `Re-draw this image as ${STYLE_PROMPT_BASE} ${prompt}`.trim();
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64ImageData,
            mimeType: mimeType,
          },
        },
        {
          text: fullPrompt,
        },
      ],
    },
    config: {
        responseModalities: [Modality.IMAGE],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const base64ImageBytes: string = part.inlineData.data;
      return base64ImageBytes;
    }
  }

  throw new Error("No image was generated from transformation.");
};