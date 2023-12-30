export function usePagination<T = unknown>(
	input: Array<T>,
	initialRowPerPage: number,
	defaultPage: number = 1
) {
	const data = $state([...input]);
	let page = $state(defaultPage);
	let rowPerPage = $state(initialRowPerPage);

	const dataOnPage = $derived(data.slice((page - 1) * rowPerPage, page * rowPerPage));
	const numberOfPages = $derived(Math.ceil(data.length / rowPerPage));

	$effect(() => {
		numberOfPages;

		return () => {
			page = 1;
		};
	});

	return {
		get page() {
			return page;
		},
		set page(value) {
			page = value;
		},
		get dataOnPage() {
			return dataOnPage;
		},
		get numberOfPages() {
			return numberOfPages;
		},
		get rowPerPage() {
			return rowPerPage;
		},
		set rowPerPage(value) {
			rowPerPage = value;
		},
		handleClick: (_event: MouseEvent, newValue: number) => {
			page = newValue;
		}
	};
}

export type UsePagination<T> = ReturnType<typeof usePagination<T>>;
