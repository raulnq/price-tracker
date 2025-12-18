import { GoogleGenerativeAI } from '@google/generative-ai';
import { ENV } from '@/env.js';
import { logger } from '@/utils/logger.js';

export type ExtractedPrice = {
  price: number | null;
  error?: string;
};

const EXTRACTION_PROMPT = `You are a price extraction assistant. Extract the main product price from the following webpage content.

Rules:
1. Find the PRIMARY selling price (not crossed-out prices, not "was" prices)
2. Return the numeric price value without currency symbols
3. If multiple prices exist, choose the main/current price

Return ONLY a valid JSON object in this exact format:
{"price": number or null, "error": "reason" or null}

Example responses:
{"price": 299.99, "error": null}
{"price": null, "error": "No price found on page"}
Webpage content:
`;

export async function extractPrice(
  pageContent: string,
  productName?: string
): Promise<ExtractedPrice> {
  try {
    const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: ENV.GEMINI_MODEL });

    const contextHint = productName
      ? `\nProduct we're looking for: ${productName}\n`
      : '';

    const truncatedContent = pageContent.slice(0, 15000);

    const result = await model.generateContent(
      EXTRACTION_PROMPT + contextHint + truncatedContent
    );

    const response = result.response;
    const text = response.text().trim();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      logger.warn({ response: text }, 'Failed to parse response as JSON');
      return {
        price: null,
        error: 'Invalid response format',
      };
    }

    const parsed = JSON.parse(jsonMatch[0]) as ExtractedPrice;

    if (parsed.price !== null && typeof parsed.price !== 'number') {
      parsed.price = parseFloat(String(parsed.price));
    }

    return {
      price: parsed.price,
      error: parsed.error || undefined,
    };
  } catch (error) {
    logger.error({ error }, 'Error extracting price');
    return {
      price: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
