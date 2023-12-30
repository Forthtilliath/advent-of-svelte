import type { PageServerLoad } from './$types';
import { ChildrenSchema } from './schemas';

export const load: PageServerLoad = async ({ fetch }) => {
	const children = await fetch('https://advent.sveltesociety.dev/data/2023/day-one.json').then(
		(r) => r.json()
	);

	return {
		children: ChildrenSchema.parse(children)
	};
};
