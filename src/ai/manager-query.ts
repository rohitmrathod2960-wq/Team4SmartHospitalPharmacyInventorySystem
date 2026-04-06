'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// INPUT
const ManagerQueryInputSchema = z.object({
  prompt: z.string(),
  data: z.string(),
});

// OUTPUT
const ManagerQueryOutputSchema = z.object({
  answer: z.string(),
});

export const managerQueryPrompt = ai.definePrompt({
  name: 'managerQueryPrompt',

  input: { schema: ManagerQueryInputSchema },
  output: { schema: ManagerQueryOutputSchema },

  prompt: `
You are an AI Inventory Analyst for a hospital pharmacy system.

You are given:
1. User Question
2. Full database analytics

--- USER QUESTION ---
{{{prompt}}}

--- DATABASE DATA ---
{{{data}}}

--- YOUR TASK ---
- Answer clearly in natural language
- Give insights like:
  - top selling medicines
  - stock levels (low/medium/high)
  - trends
  - warnings

- Be smart and analytical

Return JSON:
{
  "answer": "your answer here"
}
`,
});