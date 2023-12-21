<script lang="ts">
	import { range } from '$lib/utils';
	import Button from './button.svelte';

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
		page: number
	) {
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
			if (pagesStart.includes(page)) {
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
			let boundaryEnd = [] as number[];
			if (pagesEnd.includes(page)) {
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

			let siblingPages = [] as number[];
			if (!pagesStart.includes(page) && !pagesEnd.includes(page)) {
				siblingPages = [...siblingPages, ...allPages.slice(page - siblingCount - 1, page - 1)];
				siblingPages.push(page);
				siblingPages = [...siblingPages, ...allPages.slice(page, page + siblingCount)];
				pagination.add(-1);
			}
			siblingPages.reduce((s, e) => s.add(e), pagination);
			if (!pagesStart.includes(page) && !pagesEnd.includes(page)) {
				pagination.add(-2);
			}

			boundaryEnd.reduce((s, e) => s.add(e), pagination);
		}
		return pagination;
	}
</script>

<div>
	<Button {onChange} to={page - 1} disabled={page === 1}>&lt;</Button>

	{#each pagination as p}
		{#if p >= 0}
			<Button {onChange} active={p === page} to={p}>
				{p}
			</Button>
		{:else}
			<span class="spread">…</span>
		{/if}
	{/each}

	<Button {onChange} to={page + 1} disabled={page === count}>&gt;</Button>
</div>

<style>
	.spread {
		display: inline-block;
		user-select: none;
		font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
		font-weight: 400;
		font-size: 0.875rem;
		line-height: 1.43;
		letter-spacing: 0.01071em;
		border-radius: 16px;
		text-align: center;
		box-sizing: border-box;
		min-width: 32px;
		padding: 0 6px;
		margin: 0 3px;
		color: rgba(255, 255, 255, 0.87);
		height: auto;
	}
</style>
