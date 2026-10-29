import { z } from 'zod';

export const ExampleItemSchema = z.object({
  id: z.union([z.string(), z.number()]),
  title: z.string(),
  status: z.string().optional(),
});

export type ExampleItem = z.infer<typeof ExampleItemSchema>;
