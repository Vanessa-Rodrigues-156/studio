'use server';
/**
 * @fileOverview AI-powered tool to analyze task descriptions and prerequisites to suggest potential task collaborators.
 *
 * - suggestCollaborators - A function that handles the suggestion of potential collaborators.
 * - SuggestCollaboratorsInput - The input type for the suggestCollaborators function.
 * - SuggestCollaboratorsOutput - The return type for the suggestCollaborators function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestCollaboratorsInputSchema = z.object({
  taskDescription: z.string().describe('The description of the task.'),
  taskPrerequisites: z.string().describe('The prerequisites for the task.'),
});
export type SuggestCollaboratorsInput = z.infer<typeof SuggestCollaboratorsInputSchema>;

const SuggestCollaboratorsOutputSchema = z.object({
  suggestedCollaborators: z.array(
    z.string().describe('A potential collaborator for the task.')
  ).describe('A list of suggested collaborators based on the task description and prerequisites.'),
});
export type SuggestCollaboratorsOutput = z.infer<typeof SuggestCollaboratorsOutputSchema>;

export async function suggestCollaborators(input: SuggestCollaboratorsInput): Promise<SuggestCollaboratorsOutput> {
  return suggestCollaboratorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCollaboratorsPrompt',
  input: {
    schema: z.object({
      taskDescription: z.string().describe('The description of the task.'),
      taskPrerequisites: z.string().describe('The prerequisites for the task.'),
    }),
  },
  output: {
    schema: z.object({
      suggestedCollaborators: z.array(
        z.string().describe('A potential collaborator for the task.')
      ).describe('A list of suggested collaborators based on the task description and prerequisites.'),
    }),
  },
  prompt: `You are an AI assistant designed to suggest potential collaborators for a given task.
  Analyze the task description and prerequisites to identify individuals who possess the necessary skills and expertise to contribute effectively to the task.
  Provide a list of potential collaborators.

  Task Description: {{{taskDescription}}}
  Task Prerequisites: {{{taskPrerequisites}}}

  Suggested Collaborators:`, // Ensure the output is suitable for direct display in a comma-separated list
});

const suggestCollaboratorsFlow = ai.defineFlow<
  typeof SuggestCollaboratorsInputSchema,
  typeof SuggestCollaboratorsOutputSchema
>({
  name: 'suggestCollaboratorsFlow',
  inputSchema: SuggestCollaboratorsInputSchema,
  outputSchema: SuggestCollaboratorsOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});

