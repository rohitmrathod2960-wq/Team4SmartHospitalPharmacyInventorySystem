'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

// ✅ INPUT SCHEMA (UNCHANGED)
const PredictiveMaintenanceScheduleInputSchema = z.object({
  medicineId: z.string(),
  medicineName: z.string(),
  category: z.string(),
  usageDescription: z.string(),
  historicalFailureData: z.array(z.string()).optional(),
  manufacturerSpecifications: z.string(),
});

export type PredictiveMaintenanceScheduleInput =
  z.infer<typeof PredictiveMaintenanceScheduleInputSchema>;

// ✅ OUTPUT SCHEMA (UNCHANGED)
const PredictiveMaintenanceScheduleOutputSchema = z.object({
  schedule: z.array(
    z.object({
      task: z.string(),
      frequency: z.string(),
      dueDate: z.string(),
      notes: z.string().optional(),
    })
  ),
  overallRecommendations: z.string(),
  insights: z.string().optional(),
});

export type PredictiveMaintenanceScheduleOutput =
  z.infer<typeof PredictiveMaintenanceScheduleOutputSchema>;

// ✅ MAIN FUNCTION
export async function predictiveMaintenanceSchedule(
  input: PredictiveMaintenanceScheduleInput
): Promise<PredictiveMaintenanceScheduleOutput> {
  return predictiveMaintenanceScheduleFlow(input);
}

// ✅ PROMPT (UNCHANGED LOGIC, BETTER CONTEXT)
const predictiveMaintenanceSchedulePrompt = ai.definePrompt({
  name: 'predictiveMaintenanceSchedulePrompt',
  input: {
    schema: PredictiveMaintenanceScheduleInputSchema.extend({
      analytics: z.string(),
    }),
  },
  output: { schema: PredictiveMaintenanceScheduleOutputSchema },

  prompt: `
You are an expert in industrial medicine maintenance and inventory analytics.

Generate a predictive maintenance schedule AND also provide smart inventory insights.

--- MEDICINE DATA ---
ID: {{{medicineId}}}
Name: {{{medicineName}}}
Category: {{{category}}}

Usage: {{{usageDescription}}}

Historical Failures:
{{#if historicalFailureData}}
{{#each historicalFailureData}}
- {{{this}}}
{{/each}}
{{else}}
No data
{{/if}}

Manufacturer Specs:
{{{manufacturerSpecifications}}}

--- INVENTORY ANALYTICS ---
{{{analytics}}}

--- TASK ---
1. Generate maintenance schedule
2. Provide overall recommendations
3. Give intelligent insights based on inventory + sales
4. Highlight risks like low stock or high demand

Return JSON only.
`,
});

// ✅ FLOW
const predictiveMaintenanceScheduleFlow = ai.defineFlow(
  {
    name: 'predictiveMaintenanceScheduleFlow',
    inputSchema: PredictiveMaintenanceScheduleInputSchema,
    outputSchema: PredictiveMaintenanceScheduleOutputSchema,
  },
  async (input) => {
    // 🔹 FETCH ORDERS (SALES DATA)
    const ordersSnapshot = await getDocs(collection(db, 'orders'));
    let sales: Record<string, number> = {};

    ordersSnapshot.forEach((doc) => {
      const data = doc.data();

      data.items?.forEach((item: any) => {
        const name = item.medicineName;
        const qty = item.quantity;

        if (!sales[name]) sales[name] = 0;
        sales[name] += qty;
      });
    });

    // 🔹 FETCH PRODUCTS
    const productsSnapshot = await getDocs(collection(db, 'products'));
    let products: any[] = [];

    productsSnapshot.forEach((doc) => {
      products.push(doc.data());
    });

    // 🔹 CALCULATE ANALYTICS
    let topProduct = '';
    let maxQty = 0;

    for (let p in sales) {
      if (sales[p] > maxQty) {
        maxQty = sales[p];
        topProduct = p;
      }
    }

    // ✅ FIXED: safe threshold handling
    const lowStock = products.filter(
      (p) => p.quantity <= (p.lowStockThreshold || 0)
    );

    const totalSales = Object.values(sales).reduce(
      (a, b) => a + b,
      0
    );

    // 🔥 IMPROVED ANALYTICS STRING
    const analytics = `
📊 SALES SUMMARY:
- Top Selling Product: ${topProduct} (${maxQty} units sold)
- Total Sales: ${totalSales}

⚠️ LOW STOCK ITEMS:
${lowStock.length > 0
  ? lowStock.map((p) => `- ${p.medicineName} (${p.quantity} left)`).join('\n')
  : 'None'}

📦 CURRENT INVENTORY SNAPSHOT:
${products
  .map(
    (p) =>
      `- ${p.medicineName}: ${p.quantity} units (Threshold: ${p.lowStockThreshold || 0})`
  )
  .join('\n')}
`;

    // 🔹 CALL AI
    const { output } = await predictiveMaintenanceSchedulePrompt({
      ...input,
      analytics,
    });

    return output!;
  }
);