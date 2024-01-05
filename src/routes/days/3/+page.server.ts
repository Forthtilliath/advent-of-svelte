import type { PageServerLoad } from './$types';
import { PresentsSchema } from './schemas';

export const load: PageServerLoad = async ({ fetch }) => {
	const presents = await fetch('https://advent.sveltesociety.dev/data/2023/day-three.json').then(
		(r) => r.json()
	);

	const presentsWithId = presents.map((present: Record<string, unknown>, index: number) => ({
		...present,
		id: index
	}));

	return {
		presents: PresentsSchema.parse(presentsWithId)
	};
};
