import { z } from 'zod';

export const ChildSchema = z.object({
	name: z.string().min(3, { message: 'Name must be at least 3 characters long.' }),
	tally: z.number()
});
export const ChildrenSchema = z.array(ChildSchema);

export type Child = z.infer<typeof ChildSchema>;
