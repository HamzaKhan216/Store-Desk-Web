import type { Product, Transaction } from '../types';

// ❗️ PASTE YOUR OPENROUTER API KEY HERE ❗️
// FIX: Explicitly typed as string to avoid TypeScript literal type comparison error.
const OPENROUTER_API_KEY: string = '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';
// You can change the model to any compatible one from OpenRouter
const OPENROUTER_MODEL = "openai/gpt-oss-20b:free";

export async function getAiInsight(prompt: string, products: Product[], transactions: Transaction[]): Promise<string> {
  if (OPENROUTER_API_KEY === 'YOUR_OPENROUTER_API_KEY_HERE') {
    return "Please configure your OpenRouter API key in `services/geminiService.ts` to use the AI Assistant.";
  }

  try {
    // Perform local data analysis
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentTransactions = transactions.filter(t => t.timestamp >= thirtyDaysAgo);
    
    const salesData: { [sku: string]: { quantity: number; revenue: number } } = {};
    for (const t of recentTransactions) {
        for (const item of t.items) {
            if (!salesData[item.productSku]) {
                salesData[item.productSku] = { quantity: 0, revenue: 0 };
            }
            salesData[item.productSku].quantity += item.quantitySold;
            salesData[item.productSku].revenue += item.quantitySold * item.pricePerItem;
        }
    }

    const sortedByQuantity = Object.entries(salesData).sort((a, b) => b[1].quantity - a[1].quantity);
    
    const topSellers = sortedByQuantity.slice(0, 3).map(([sku, data]) => {
        const product = products.find(p => p.sku === sku);
        return `${product?.name || sku}: Sold ${data.quantity} units.`;
    }).join('\n');

    const allSoldSkus = new Set(Object.keys(salesData));
    const slowMovers = products
        .filter(p => !allSoldSkus.has(p.sku))
        .slice(0, 3)
        .map(p => p.name)
        .join(', ');

    const restockAlerts = sortedByQuantity.map(([sku, data]) => {
        const product = products.find(p => p.sku === sku);
        if (product && product.quantity <= product.lowStockThreshold) {
            return `${product.name} is a top seller and has low stock (${product.quantity} left).`;
        }
        return null;
    }).filter(Boolean).join('\n');

    const analysisContext = `
      - Top selling products (last 30 days):
      ${topSellers || 'Not enough data.'}
      - Potential slow-moving items (no sales in last 30 days):
      ${slowMovers || 'None'}
      - Urgent restock recommendations:
      ${restockAlerts || 'None'}
    `;

    const systemPrompt = `You are an expert inventory management AI assistant for a platform called Stock Desk. 
      Your goal is to provide a concise, actionable, and friendly response based on the provided data analysis.
      Do not use markdown formatting. Address the user directly.
      Here is a summary of the inventory analysis to use as your context:
      ${analysisContext}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": OPENROUTER_MODEL,
        "messages": [
          { "role": "system", "content": systemPrompt },
          { "role": "user", "content": prompt }
        ]
      })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    return "Sorry, I encountered an error while processing your request. Please check your OpenRouter key and try again.";
  }
}