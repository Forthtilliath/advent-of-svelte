<script lang="ts">
	import { range } from '$lib/utils';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';

	type $$Props = {
		/** Nombre de pages */
		count: number;
		/** Page courante */
		page: number;
		/** Nombre de pages avant et après la page courante */
		siblingCount?: number;
		/** Nombre de pages à coté de la première et dernière page */
		boundaryCount?: number;
		/** Action quand on clique sur une page */
		onChange: (event: MouseEvent, value: number) => void;
	};

	let { count, page, siblingCount = 1, boundaryCount = 1, onChange } = $props<$$Props>();

	const SPREAD_LEFT = -1;
	const SPREAD_RIGHT = -2;

	/** Contient toutes les pages */
	const allPages = $state(range(1, count));

	/**
	 * Nombre de pages que l'on peut afficher au total.
	 * Si on peut afficher plus de pages qu'il n'y en a, pas besoin de filtrer.
	 */
	const nbPagesDisplay = $derived(
		/** first */ 1 +
			/** last */ 1 +
			/** current */ 1 +
			/** avant/après */ siblingCount * 2 +
			/** start/end */ boundaryCount * 2
	);

	/**
	 * Liste des numéros de pages contenus dans la pagination.
	 *
	 * Les spreads ont des valeurs négatives afin d'afficher un span spécial.
	 */
	let pagination = $derived(
		getPagination(nbPagesDisplay, count, allPages, siblingCount, boundaryCount, page)
	);

	/**
	 * Returns a set of pagination numbers based on the provided parameters.
	 *
	 * @param nbPagesDisplay - The number of pages to display.
	 * @param count - The total number of pages.
	 * @param allPages - An array of all available pages.
	 * @param siblingCount - The number of sibling pages to display on each side of the current page.
	 * @param boundaryCount - The number of boundary pages to display at the start and end.
	 * @param currentPage - The current page number.
	 * @returns A set of pagination numbers.
	 */
	function getPagination(
		nbPagesDisplay: number,
		count: number,
		allPages: number[],
		siblingCount: number,
		boundaryCount: number,
		currentPage: number
	): Set<number> {
		function getPreviousPages(startingPages: Set<number>): Set<number> {
			const previousPages = new Set<number>();

			if (startingPages.has(currentPage)) {
				startingPages.forEach((page) => previousPages.add(page));
				if (siblingCount > 0) {
					const prevSiblingPages = new Set(
						allPages.slice(startingPages.size, startingPages.size + siblingCount)
					);
					prevSiblingPages.forEach((page) => previousPages.add(page));
				}
			} else {
				const prevBoundaryPages = new Set(allPages.slice(0, boundaryCount));
				prevBoundaryPages.forEach((page) => previousPages.add(page));
			}

			previousPages.add(SPREAD_LEFT);

			return previousPages;
		}

		function getMiddlePages(startingPages: Set<number>, endingPages: Set<number>): Set<number> {
			const middlePages = new Set<number>();

			if (!startingPages.has(currentPage) && !endingPages.has(currentPage)) {
				const nextSiblingPages = allPages.slice(
					currentPage - siblingCount - 1,
					currentPage + siblingCount
				);
				for (const page of nextSiblingPages) {
					middlePages.add(page);
				}

				middlePages.add(SPREAD_RIGHT);
			}

			return middlePages;
		}

		function getNextPages(endingPages: Set<number>): Set<number> {
			const nextPages = new Set<number>();

			if (endingPages.has(currentPage)) {
				if (siblingCount > 0) {
					for (let i = count - endingPages.size - siblingCount; i < count - endingPages.size; i++) {
						nextPages.add(allPages[i]!);
					}
				}
				endingPages.forEach((page) => nextPages.add(page));
			} else {
				for (let i = count - boundaryCount - 1 + 1; i < allPages.length; i++) {
					nextPages.add(allPages[i]!);
				}
			}

			return nextPages;
		}

		const pagination = new Set<number>();
		if (nbPagesDisplay >= count) {
			allPages.forEach((page) => pagination.add(page));
		} else {
			/** Contient l'ensemble des pages de début si la page courante est la première page */
			const startingPages = new Set(
				allPages.slice(0, /** spread */ 1 + boundaryCount + /** page */ 1 + siblingCount)
			);

			/** Contient l'ensemble des pages de fin si la page courante est la dernière page */
			const endingPages = new Set(
				allPages.slice(
					/** spread */ count - siblingCount - boundaryCount - /** page */ 1 - /** index array */ 1
				)
			);

			let previousPages: Set<number> = getPreviousPages(startingPages);
			let middlePages: Set<number> = getMiddlePages(startingPages, endingPages);
			let nextPages: Set<number> = getNextPages(endingPages);

			previousPages.forEach((page) => pagination.add(page));
			middlePages.forEach((page) => pagination.add(page));
			nextPages.forEach((page) => pagination.add(page));
		}
		return pagination;
	}
</script>

<div class="flex gap-1">
	{@render buttonPaginate({ page: page - 1, disabled: page === 1, label: 'prev' })}

	{#each pagination as p}
		{#if p >= 0}
			{@render buttonPaginate({ active: p === page, page: p, label: p.toString() })}
		{:else}
			{@render buttonPaginate({ active: p === page, disabled: true, label: '…' })}
		{/if}
	{/each}

	{@render buttonPaginate({ page: page + 1, disabled: page === count, label: 'next' })}
</div>

{#snippet buttonPaginate({ active = false, page, disabled, label }: {active?: boolean, page?: number, disabled?: boolean, label: string})}
	{@const onClick = page ? (e:MouseEvent) => onChange(e, page) :  (e:MouseEvent)=>{}}
	<Button
		variant="ghost"
		size="icon"
		rounded="full"
		class={active ? 'bg-accent text-accent-foreground' : ''}
		{disabled}
		on:click={onClick}
	>
		{#if label === 'prev'}
			<span class="sr-only">Previous page</span>
			<ChevronLeft className="h-4 w-4" />
		{:else if label === 'next'}
			<span class="sr-only">Next page</span>
			<ChevronRight className="h-4 w-4" />
		{:else}
			{label}
		{/if}
	</Button>
{/snippet}
