import type { PageLoad } from './$types';
import { ChildrenSchema, type Children } from './schemas';
// import { browser } from '$app/environment';

export const load: PageLoad = async ({ fetch }) => {
	let children: Children = [];
	// if (browser) {
	// 	const ls = localStorage.getItem('day1-children');
	// 	if (ls) {
	// 		const lsParsed = ChildrenSchema.safeParse(JSON.parse(ls));
	// 		if (lsParsed.success) {
	// 			console.log(lsParsed.data);
	// 			return {
	// 				children: lsParsed.data
	// 			};
	// 		}
	// 	}

		children = await fetch('https://advent.sveltesociety.dev/data/2023/day-one.json').then((r) =>
			r.json()
		);
	// }

	return {
		children: ChildrenSchema.parse(children)
	};
};
