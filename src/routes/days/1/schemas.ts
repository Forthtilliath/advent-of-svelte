import { z } from 'zod';

export const ChildSchema = z.object({
	name: z.string(),
	tally: z.number()
});
export const ChildrenSchema = z.array(ChildSchema);

export type Child = z.infer<typeof ChildSchema>;
