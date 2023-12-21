import type { PageLoad } from './$types';
import { ChildrenSchema } from './schemas';

export const load: PageLoad = async ({ fetch }) => {
	const children = await fetch('https://advent.sveltesociety.dev/data/2023/day-one.json').then(
		(r) => r.json()
	);

	return {
		children: ChildrenSchema.parse(children)
	};
};
