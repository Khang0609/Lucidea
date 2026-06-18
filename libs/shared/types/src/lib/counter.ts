import { z } from 'zod';

export const CounterResponseSchema = z.object({
  value: z.number().int(),
});

export type CounterResponse = z.infer<typeof CounterResponseSchema>;
