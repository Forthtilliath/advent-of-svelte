<script lang="ts">
import * as Table from '$lib/components/ui/table';
import { Badge } from '$lib/components/ui/badge';
import Pagination from '$lib/components/shared/pagination.svelte';
import Button from '$lib/components/ui/button/button.svelte';
import { ChildrenSchema, type Child, ChildSchema } from './schemas.js';
import { usePagination, type UsePagination } from '$lib/hooks/usePagination.svelte';
import { useStorage } from '$lib/hooks/useStorage.svelte';
import { createCounter } from '$lib/hooks/createCounter.js';
import Input from '$lib/components/ui/input/input.svelte';

const { data } = $props();

let children = $state(
	useStorage('children', data.children, {
		schema: ChildrenSchema
	})
);
let pagination = $state<UsePagination<Child>>();

$effect(() => {
	pagination = usePagination(children, 10);
	localStorage.setItem('children', JSON.stringify(children));
});

function onsubmit(e: SubmitEvent & { currentTarget: HTMLFormElement }) {
	const data = Object.fromEntries(new FormData(e.currentTarget));

	const nameSchema = ChildSchema.omit({ tally: true });
	const parsedForm = nameSchema.safeParse(data);

	if (!parsedForm.success) {
		return;
	}

	const newChild = { ...parsedForm.data, tally: 0 };
	children = [newChild, ...children];
}
</script>

<div class="grid grid-cols-[1fr_300px] gap-4">
	<div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-6">
		<header class="space-y-1.5">
			<h2 class="text-lg font-semibold leading-none tracking-tight">Naughty or Nice</h2>
		</header>

		{#if pagination}
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
						{#each pagination.dataOnPage as child}
							{@const tally = createCounter((v) => (child.tally = v), child.tally)}
							<Table.Row>
								<Table.Cell class="font-medium">{child.name}</Table.Cell>
								<Table.Cell class="text-center">
									{#if tally.value > 0}
										<span class="text-green-500">+{tally.value}</span>
									{:else if tally.value === 0}
										<span class="text-slate-50">{tally.value}</span>
									{:else}
										<span class="text-red-500">{tally.value}</span>
									{/if}
								</Table.Cell>
								<Table.Cell class="text-center">
									{#if tally.value > 0}
										<Badge variant="success" space="lg">Nice</Badge>
									{:else if tally.value === 0}
										<Badge variant="secondary" space="lg">-</Badge>
									{:else}
										<Badge variant="destructive" space="lg">Naughty</Badge>
									{/if}
								</Table.Cell>
								<Table.Cell class="text-center">
									<Button on:click={tally.decrement} size="sm" variant="destructive">-1</Button>
									<Button on:click={tally.reset} size="sm" variant="secondary">Reset</Button>
									<Button on:click={tally.increment} size="icon-sm" variant="success">+1</Button>
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
				<div class="mt-4 flex justify-between items-center">
					<div class="flex items-center gap-2">
						<span>Show</span>
						<select
							bind:value={pagination.rowPerPage}
							class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-16">
							{#each [10, 15, 20, 25] as value}
								<option {value}>
									{value}
								</option>
							{/each}
						</select>
						<span>rows per page</span>
					</div>

					{#key pagination.numberOfPages}
						<Pagination
							count={pagination.numberOfPages}
							page={pagination.page}
							onChange={pagination.handleClick}
							siblingCount={0} />
					{/key}
				</div>
			</main>
		{/if}
	</div>
	<div>
		<div class="rounded-lg border bg-card text-card-foreground shadow-sm">
			<form {onsubmit}>
				<div class="p-6 space-y-6">
					<header class="space-y-1.5">
						<h2 class="text-lg font-semibold leading-none tracking-tight">Add Child</h2>
					</header>

					<main>
						<Input name="name" />
					</main>

					<footer>
						<Button type="submit">Add</Button>
					</footer>
				</div>
			</form>
		</div>
	</div>
</div>
