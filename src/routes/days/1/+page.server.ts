import { ChildrenSchema, type Children } from './schemas';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	let children: Children = [];
	children = await fetch('https://advent.sveltesociety.dev/data/2023/day-one.json').then((r) =>
		r.json()
	);

	return {
		children: ChildrenSchema.parse(children)
	};
};
