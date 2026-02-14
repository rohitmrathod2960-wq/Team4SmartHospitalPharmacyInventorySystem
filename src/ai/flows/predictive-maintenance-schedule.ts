'use server';
/**
 * @fileOverview A Genkit flow for generating a predictive maintenance schedule for equipment.
 *
 * - predictiveMaintenanceSchedule - A function that handles the predictive maintenance schedule generation.
 * - PredictiveMaintenanceScheduleInput - The input type for the predictiveMaintenanceSchedule function.
 * - PredictiveMaintenanceScheduleOutput - The return type for the predictiveMaintenanceSchedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictiveMaintenanceScheduleInputSchema = z.object({
  equipmentId: z.string().describe('The unique identifier for the equipment.'),
  equipmentName: z.string().describe('The name of the equipment (e.g., "Excavator 3000").'),
  category: z.string().describe('The category of the equipment (e.g., "Heavy Machinery", "Generator").'),
  usageDescription: z
    .string()
    .describe(
      'A detailed description of how the equipment is currently being used, including hours, intensity, and environment (e.g., "Used for heavy-duty digging 12 hours/day in a dusty environment").'
    ),
  historicalFailureData: z
    .array(z.string())
    .describe('A list of past failure events or maintenance records (e.g., "Motor failure at 5000 hours", "Bearing replacement 6 months ago").')
    .optional(),
  manufacturerSpecifications: z
    .string()
    .describe('Manufacturer guidelines and specifications for maintenance (e.g., "Service every 1000 hours or 6 months, whichever comes first").'),
});
export type PredictiveMaintenanceScheduleInput = z.infer<typeof PredictiveMaintenanceScheduleInputSchema>;

const PredictiveMaintenanceScheduleOutputSchema = z.object({
  schedule: z.array(
    z.object({
      task: z.string().describe('Description of the maintenance task (e.g., "Check oil level", "Replace air filter").'),
      frequency: z
        .string()
        .describe('How often the task should be performed (e.g., "Monthly", "Every 500 operating hours", "Annually").'),
      dueDate: z.string().describe('A suggested next due date for the task in YYYY-MM-DD format (e.g., "2024-12-01").'),
      notes: z.string().describe('Any additional notes or recommendations for the task.').optional(),
    })
  ),
  overallRecommendations: z.string().describe('Overall recommendations for equipment longevity and performance.'),
});
export type PredictiveMaintenanceScheduleOutput = z.infer<typeof PredictiveMaintenanceScheduleOutputSchema>;

export async function predictiveMaintenanceSchedule(
  input: PredictiveMaintenanceScheduleInput
): Promise<PredictiveMaintenanceScheduleOutput> {
  return predictiveMaintenanceScheduleFlow(input);
}

const predictiveMaintenanceSchedulePrompt = ai.definePrompt({
  name: 'predictiveMaintenanceSchedulePrompt',
  input: {schema: PredictiveMaintenanceScheduleInputSchema},
  output: {schema: PredictiveMaintenanceScheduleOutputSchema},
  prompt: `You are an expert in industrial equipment maintenance and predictive analysis.
Your task is to generate a detailed predictive maintenance schedule for a given piece of equipment.

Consider the following information:
Equipment ID: {{{equipmentId}}}
Equipment Name: {{{equipmentName}}}
Category: {{{category}}}

Usage Description: {{{usageDescription}}}

Historical Failure Data:
{{#if historicalFailureData}}
{{#each historicalFailureData}}
- {{{this}}}
{{/each}}
{{else}}
No historical failure data provided.
{{/if}}

Manufacturer Specifications: {{{manufacturerSpecifications}}}

Based on this data, provide a comprehensive maintenance schedule aimed at minimizing downtime and extending equipment lifespan. Each task should have a clear description, a recommended frequency, a suggested next due date, and any relevant notes.
Also, provide overall recommendations for the equipment.

Ensure your output is a JSON object matching the following structure:
`,
});

const predictiveMaintenanceScheduleFlow = ai.defineFlow(
  {
    name: 'predictiveMaintenanceScheduleFlow',
    inputSchema: PredictiveMaintenanceScheduleInputSchema,
    outputSchema: PredictiveMaintenanceScheduleOutputSchema,
  },
  async input => {
    const {output} = await predictiveMaintenanceSchedulePrompt(input);
    return output!;
  }
);
