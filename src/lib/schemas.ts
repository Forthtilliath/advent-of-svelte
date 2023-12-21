import { z } from 'zod';

export const DaySchema = z.object({
	day: z.number(),
	title: z.string()
});
export const DaysSchema = z.array(DaySchema);

export type Day = z.infer<typeof DaySchema>;
