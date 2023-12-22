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
	 * Liste des numéros de pages contenus dans la pagination
	 * Les spreads ont les valeurs -1 et -2 afin d'afficher un span spécial
	 */
	let pagination = $derived(
		getPagination(nbPagesDisplay, count, allPages, siblingCount, boundaryCount, page)
	);

	function getPagination(
		nbPagesDisplay: number,
		count: number,
		allPages: number[],
		siblingCount: number,
		boundaryCount: number,
		currentPage: number
	): Set<number> {
		const pagination = new Set<number>();
		if (nbPagesDisplay >= count) {
			allPages.reduce((s, e) => s.add(e), pagination);
		} else {
			const pagesStart = allPages.slice(
				0,
				/** spread */ 1 + boundaryCount + /** page */ 1 + siblingCount
			);

			const pagesEnd = allPages.slice(
				/** spread */ count - siblingCount - boundaryCount - /** page */ 1 - /** index array */ 1
			);

			/** Contient les pages de début */
			let boundaryStart = [] as number[];
			if (pagesStart.includes(currentPage)) {
				boundaryStart = pagesStart.slice(0);
				if (siblingCount > 0) {
					const nexts = allPages.slice(pagesStart.length, pagesStart.length + siblingCount);
					boundaryStart.push(...nexts);
				}
			} else {
				boundaryStart = allPages.slice(0, boundaryCount);
			}
			boundaryStart.reduce((s, e) => s.add(e), pagination);

			pagination.add(-1);

			/** Contient les pages de fin */
			let boundaryEnd: number[] = [];
			if (pagesEnd.includes(currentPage)) {
				boundaryEnd = pagesEnd.slice(0);
				if (siblingCount > 0) {
					const prevs = allPages.slice(
						count - pagesEnd.length - siblingCount,
						count - pagesEnd.length
					);
					boundaryEnd.unshift(...prevs);
				}
			} else {
				boundaryEnd = allPages.slice(
					count - boundaryCount - /** index array */ 1 + /** element */ 1
				);
			}

			let siblingPages: number[] = [];
			if (!pagesStart.includes(currentPage) && !pagesEnd.includes(currentPage)) {
				siblingPages = [...siblingPages, ...allPages.slice(currentPage - siblingCount - 1, currentPage - 1)];
				siblingPages.push(currentPage);
				siblingPages = [...siblingPages, ...allPages.slice(currentPage, currentPage + siblingCount)];
				pagination.add(-1);
			}
			siblingPages.reduce((s, e) => s.add(e), pagination);
			if (!pagesStart.includes(currentPage) && !pagesEnd.includes(currentPage)) {
				pagination.add(-2);
			}

			boundaryEnd.reduce((s, e) => s.add(e), pagination);
		}
		return pagination;
	}
</script>

<div class="flex gap-1">
	<Button
		variant="ghost"
		size="icon"
		rounded="full"
		disabled={page === 1}
		on:click={(e) => onChange(e, page - 1)}
	>
		<span class="sr-only">Previous page</span>
		<ChevronLeft className="h-4 w-4" />
	</Button>
	{@render buttonPaginate({ page: page - 1, disabled: page === 1 })}

	{#each pagination as p}
		{#if p >= 0}
			{@render buttonPaginate({ active: p === page, page: p })}
		{:else}
			{@render buttonPaginate({ active: p === page })}
		{/if}
	{/each}

	<Button
		variant="ghost"
		size="icon"
		rounded="full"
		disabled={page === count}
		on:click={(e) => onChange(e, page + 1)}
	>
		<span class="sr-only">Next page</span>
		<ChevronRight className="h-4 w-4" />
	</Button>
</div>

{#snippet buttonPaginate({
	active = false, page, disabled, label = page?.toString() ?? '…'
}: {active?: boolean, page?: number, disabled?: boolean, label?: string})}
	{@const onClick = page ? (e:MouseEvent) => onChange(e, page) :  (e:MouseEvent)=>{}}
	<Button
		variant="ghost"
		size="icon"
		rounded="full"
		class={active ? 'bg-accent text-accent-foreground' : ''}
		{disabled}
		on:click={onClick}
	>
		{label}
	</Button>
{/snippet}