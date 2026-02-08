import { MailtrapClient } from 'mailtrap';
import { ENV } from '#/env.js';
import { logger } from '#/logger.js';
import type { Product } from '#/features/products/schemas.js';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

let client: MailtrapClient | null = null;

if (ENV.MAILTRAP_API_TOKEN) {
  client = new MailtrapClient({
    token: ENV.MAILTRAP_API_TOKEN,
  });
}

export type PriceDrop = {
  product: Product;
  previousPrice: number;
  newPrice: number;
  priceChangePercentage: number;
};

export async function sendPriceDropSummaryEmail(
  priceDrops: PriceDrop[]
): Promise<void> {
  if (priceDrops.length === 0) {
    return;
  }

  if (!client) {
    logger.debug('Mailtrap not configured, skipping email notification');
    return;
  }

  try {
    const subject =
      priceDrops.length === 1
        ? `Price Drop Alert: ${priceDrops[0].product.name}`
        : `Price Drop Alert: ${priceDrops.length} products`;

    const textContent = priceDrops
      .map(drop => {
        const formattedPrevious = drop.previousPrice.toFixed(2);
        const formattedNew = drop.newPrice.toFixed(2);
        const formattedPercentage = Math.abs(
          drop.priceChangePercentage
        ).toFixed(2);
        return `${drop.product.name}
  Previous: ${drop.product.currency} ${formattedPrevious}
  New: ${drop.product.currency} ${formattedNew} (-${formattedPercentage}%)
  URL: ${drop.product.url}`;
      })
      .join('\n\n');

    const productRowsHtml = priceDrops
      .map(drop => {
        const formattedPrevious = drop.previousPrice.toFixed(2);
        const formattedNew = drop.newPrice.toFixed(2);
        const formattedPercentage = Math.abs(
          drop.priceChangePercentage
        ).toFixed(2);
        const safeName = escapeHtml(drop.product.name);
        const safeUrl = escapeHtml(drop.product.url);
        const safeCurrency = escapeHtml(drop.product.currency);
        return `
        <tr>
          <td style="padding: 15px; border-bottom: 1px solid #eee;">
            <a href="${safeUrl}" style="color: #333; text-decoration: none; font-weight: bold;">${safeName}</a>
          </td>
          <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: center;">
            <span style="color: #999; text-decoration: line-through;">${safeCurrency} ${formattedPrevious}</span>
          </td>
          <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: center;">
            <span style="color: #4CAF50; font-weight: bold;">${safeCurrency} ${formattedNew}</span>
          </td>
          <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: center;">
            <span style="background-color: #4CAF50; color: white; padding: 4px 8px; border-radius: 4px; font-size: 14px;">-${formattedPercentage}%</span>
          </td>
        </tr>`;
      })
      .join('');

    await client.send({
      from: {
        name: 'Price Tracker',
        email: ENV.ALERT_EMAIL_FROM,
      },
      to: [{ email: ENV.ALERT_EMAIL_TO }],
      subject,
      text: `Price Drop Summary\n\n${priceDrops.length} product(s) have dropped in price:\n\n${textContent}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 700px; margin: 0 auto; }
    .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
    .header h1 { margin: 0; }
    .summary { padding: 15px 20px; background-color: #e8f5e9; text-align: center; }
    .content { padding: 20px; }
    table { width: 100%; border-collapse: collapse; background-color: white; }
    th { background-color: #f5f5f5; padding: 12px 15px; text-align: left; font-weight: bold; border-bottom: 2px solid #ddd; }
    th:not(:first-child) { text-align: center; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; background-color: #f9f9f9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Price Drop Alert!</h1>
    </div>
    <div class="summary">
      <strong>${priceDrops.length}</strong> product${priceDrops.length > 1 ? 's have' : ' has'} dropped in price
    </div>
    <div class="content">
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Was</th>
            <th>Now</th>
            <th>Discount</th>
          </tr>
        </thead>
        <tbody>
          ${productRowsHtml}
        </tbody>
      </table>
    </div>
    <div class="footer">
      <p>You received this email because you are tracking these products on Price Tracker.</p>
    </div>
  </div>
</body>
</html>
      `.trim(),
    });

    logger.info(
      {
        count: priceDrops.length,
        products: priceDrops.map(d => ({
          productId: d.product.productId,
          priceChangePercentage: d.priceChangePercentage,
        })),
      },
      'Price drop summary email sent successfully'
    );
  } catch (error) {
    logger.error(error, 'Failed to send price drop summary email');
  }
}
