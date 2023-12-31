<script lang="ts">
import Pagination from '$lib/components/shared/pagination.svelte';
import { Badge } from '$lib/components/ui/badge';
import Button from '$lib/components/ui/button/button.svelte';
import Input from '$lib/components/ui/input/input.svelte';
import Label from '$lib/components/ui/label/label.svelte';
import * as Table from '$lib/components/ui/table';
import { createCounter } from '$lib/hooks/createCounter.svelte.js';
import { usePagination, type UsePagination } from '$lib/hooks/usePagination.svelte';
import { useStorage } from '$lib/hooks/useStorage.svelte.js';
import { z } from 'zod';

import { ChildrenSchema, ChildSchema, type Child } from './schemas.js';

const DEFAULT_ROW_PER_PAGE = 10;

const nameSchema = ChildSchema.omit({ tally: true });
type FieldErrors = z.typeToFlattenedError<z.infer<typeof nameSchema>>['fieldErrors'];

const { data } = $props();
let fieldErrors = $state<FieldErrors>({});

let children = $state(
	useStorage('children', data.children, {
		schema: ChildrenSchema
	})
);
let pagination = $state<UsePagination<Child>>();

$effect(() => {
	pagination = usePagination(children.value, DEFAULT_ROW_PER_PAGE);
});

function onsubmit(e: SubmitEvent & { currentTarget: HTMLFormElement }) {
	e.preventDefault();

	const data = Object.fromEntries(new FormData(e.currentTarget));
	const parsedForm = nameSchema.safeParse(data);

	if (!parsedForm.success) {
		fieldErrors = parsedForm.error.flatten()['fieldErrors'];
		return;
	}

	const { name } = parsedForm.data;
	if (children.value.some((child) => child.name === name)) {
		fieldErrors.name = ['Child already accounting'];
		return;
	}

	fieldErrors = {};
	const newChild = { name, tally: 0 };
	children.value = [newChild, ...children.value];
	if (pagination) {
		pagination.page = 1;
	}

	e.currentTarget.reset();
}
</script>

<div class="grid lg:grid-cols-[1fr_300px] md:grid-rows-[auto_1fr] flex-col-reverse gap-4">
	<div
		class="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-6 order-2 lg:order-1">
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
							{@const tally = createCounter({
								updater: (v) => {
									child.tally = v;
									children.value = children.value;
								},
								initialValue: child.tally
							})}
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
	<div class=" order-1 lg:order-2">
		<div class="rounded-lg border bg-card text-card-foreground shadow-sm">
			<form {onsubmit} method="POST">
				<div class="p-6 space-y-6">
					<header class="space-y-1.5">
						<h2 class="text-lg font-semibold leading-none tracking-tight">Add Child</h2>
					</header>

					<main>
						<Label>
							<span>Child's name:</span>
							<Input name="name" />
						</Label>
						<span class="text-sm text-muted-foreground"
							>By default, a child is neither good nor bad</span>
						{#if fieldErrors?.name}
							<p class="mt-2 text-sm text-red-600 dark:text-red-500">
								<span class="font-medium">Oops!</span>
								{fieldErrors.name.map((err) => err).join(', ')}
							</p>
						{/if}
					</main>

					<footer>
						<Button type="submit">Add</Button>
					</footer>
				</div>
			</form>
		</div>
	</div>
</div>
