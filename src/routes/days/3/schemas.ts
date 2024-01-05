import { z } from 'zod';

export const PresentSchema = z.object({
	id: z.number().int().nonnegative({ message: 'ID must be a non-negative integer.' }),
	name: z.string().min(3, { message: 'Name must be at least 3 characters long.' }),
	weight: z.number().min(0, { message: 'Weight must be at least 0.' })
});
export const PresentsSchema = z.array(PresentSchema);

export type Present = z.infer<typeof PresentSchema>;
