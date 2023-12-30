import { DaysSchema } from '$lib/schemas';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const days = await fetch('/api/days').then((r) => r.json());

	return {
		days: DaysSchema.parse(days)
	};
};
