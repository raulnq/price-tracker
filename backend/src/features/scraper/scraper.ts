import { chromium, type Browser } from 'playwright';
import { client } from '#/database/client.js';
import { products } from '#/features/products/product.js';
import { extractPrice, type ExtractedPrice } from './extractor.js';
import { logger } from '#/logger.js';
import { addPriceHistory } from '#/features/products/add-price-history.js';
import { deleteOldPriceHistories } from '#/features/products/delete-old-price-histories.js';
import type { Product } from '../products/schemas.js';

export type ScrapeResult = ExtractedPrice & {
  productId: string;
  success: boolean;
  priceChangePercentage?: number;
  previousPrice?: number | null;
  product: Product;
};

async function fetchPageContent(
  url: string,
  browser: Browser
): Promise<string> {
  const page = await browser.newPage();

  try {
    await page.setViewportSize({ width: 1280, height: 720 });

    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
    });

    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    const content = await page.evaluate(() => {
      const scripts = document.querySelectorAll('script, style, noscript');
      scripts.forEach(el => el.remove());
      return document.body.innerText || '';
    });

    return content;
  } finally {
    await page.close();
  }
}

export async function scrapeProduct(
  product: Product,
  browser: Browser
): Promise<ScrapeResult> {
  const startTime = Date.now();

  try {
    logger.info(
      { productId: product.productId, url: product.url },
      'Starting scrape for product'
    );

    const pageContent = await fetchPageContent(product.url, browser);

    const extracted: ExtractedPrice = await extractPrice(
      pageContent,
      product.name
    );

    if (extracted.price !== null && extracted.price > 0) {
      const result = await addPriceHistory(product, extracted.price);
      await deleteOldPriceHistories(product, 30);
      const duration = Date.now() - startTime;
      logger.info(
        {
          productId: product.productId,
          price: extracted.price,
          priceChangePercentage: result.priceChangePercentage,
          durationMs: duration,
        },
        'Successfully scraped and updated price'
      );

      return {
        productId: product.productId,
        success: true,
        price: extracted.price,
        priceChangePercentage: result.priceChangePercentage,
        previousPrice: result.previousPrice,
        product,
      };
    }

    logger.warn(
      {
        productId: product.productId,
        error: extracted.error,
      },
      'Failed to extract price'
    );

    return {
      productId: product.productId,
      success: false,
      price: null,
      error: extracted.error || 'Failed to extract price',
      product,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    logger.error(error, `Error scraping product ${product.productId}`);

    return {
      productId: product.productId,
      success: false,
      price: null,
      error: errorMessage,
      product,
    };
  }
}

export async function scrapeProducts(): Promise<ScrapeResult[]> {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    logger.info('Browser started');

    const allProducts = await client.select().from(products);

    logger.info({ count: allProducts.length }, 'Starting scrape');

    const results: ScrapeResult[] = [];

    for (const product of allProducts) {
      const result = await scrapeProduct(product, browser);
      results.push(result);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    logger.info('Scrape completed');

    return results;
  } finally {
    if (browser) {
      await browser.close();
      logger.info('Browser closed');
    }
  }
}
