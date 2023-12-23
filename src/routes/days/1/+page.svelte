<script lang="ts">
import * as Table from '$lib/components/ui/table';
import { Badge } from '$lib/components/ui/badge';
import Pagination from '$lib/components/shared/pagination.svelte';
import Button from '$lib/components/ui/button/button.svelte';
import type { Child } from './schemas.js';

const { data } = $props();

let rowPerPage = $state(10);
let page = $state(1);

const childrenOnPage = $derived(data.children.slice((page - 1) * rowPerPage, page * rowPerPage));
const numberOfPages = $derived(Math.floor(data.children.length / rowPerPage));

$effect(() => {
	numberOfPages;

	return () => {
		page = 1;
	};
});

function handleClick(_event: MouseEvent, value: number) {
	page = value;
}

function decrement(child: Child) {
	child.tally -= 1;
}
function reset(child: Child) {
	child.tally = 0;
}
function increment(child: Child) {
	child.tally += 1;
}
</script>

<div class="grid grid-cols-2 gap-4">
	<div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-6">
		<header class="space-y-1.5">
			<h2 class="text-lg font-semibold leading-none tracking-tight">Naughty or Nice</h2>
		</header>

		<main>
			<Table.Root>
				<Table.Caption>Keep track of whether they’re good or bad</Table.Caption>
				<Table.Header>
					<Table.Row>
						<Table.Head class="w-[100px]">Name</Table.Head>
						<Table.Head class="text-center">Tally</Table.Head>
						<Table.Head class="text-center">Status</Table.Head>
						<Table.Head class="text-center">Controls</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each childrenOnPage as child}
						<Table.Row>
							<Table.Cell class="font-medium">{child.name}</Table.Cell>
							<Table.Cell class="text-center">
								{#if child.tally > 0}
									<span class="text-green-500">+{child.tally}</span>
								{:else if child.tally === 0}
									<span class="text-slate-50">{child.tally}</span>
								{:else}
									<span class="text-red-500">{child.tally}</span>
								{/if}
							</Table.Cell>
							<Table.Cell class="text-center">
								{#if child.tally > 0}
									<Badge variant="success" space="lg">Nice</Badge>
								{:else if child.tally === 0}
									<Badge variant="secondary" space="lg">-</Badge>
								{:else}
									<Badge variant="destructive" space="lg">Naughty</Badge>
								{/if}
							</Table.Cell>
							<Table.Cell class="text-center">
								<Button on:click={() => decrement(child)} size="sm" variant="destructive"
									>-1</Button>
								<Button on:click={() => reset(child)} size="sm" variant="secondary">Reset</Button>
								<Button on:click={() => increment(child)} size="icon-sm" variant="success"
									>+1</Button>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
			<div class="mt-4 flex justify-between">
				<select
					bind:value={rowPerPage}
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-16">
					{#each [8, 10, 15, 20, 25] as value}
						<option {value}>
							{value}
						</option>
					{/each}
				</select>
				{#key numberOfPages}
					<Pagination count={numberOfPages} {page} onChange={handleClick} siblingCount={0} />
				{/key}
			</div>
		</main>
	</div>
	<div>
		<div class="rounded-lg border bg-card text-card-foreground shadow-sm">FORM</div>
	</div>
</div>
