<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Badge } from '$lib/components/ui/badge';
	import Button from '$lib/components/app/button.svelte';
	import Pagination from '$lib/components/shared/pagination.svelte';

	const { data } = $props();
	let page = $state(1);
	$inspect(page)

	function handleClick(event: MouseEvent, value: number) {
		console.log('Clicked', event, value);
		page = value
	}
</script>

<div class="grid grid-cols-2 gap-4">
	<div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-6">
		<header class="space-y-1.5">
			<h2 class="text-lg font-semibold leading-none tracking-tight">Naughty or Nice</h2>
			<span class="text-sm text-muted-foreground">Keep track of whether they’re good or bad</span>
		</header>

		<main>
			<Table.Root>
				<Table.Caption>A list of your recent invoices.</Table.Caption>
				<Table.Header>
					<Table.Row>
						<Table.Head class="w-[100px]">Name</Table.Head>
						<Table.Head class="text-center">Tally</Table.Head>
						<Table.Head class="text-center">Status</Table.Head>
						<Table.Head class="text-center">Controls</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.children as child}
						<Table.Row>
							<Table.Cell class="font-medium">{child.name}</Table.Cell>
							<Table.Cell class="text-center">
								{#if child.tally > 0}
									<span class="text-green-500">+{child.tally}</span>
								{:else}
									<span class="text-red-500">{child.tally}</span>
								{/if}
							</Table.Cell>
							<Table.Cell class="text-center">
								{#if child.tally > 0}
									<Badge variant="success">Nice</Badge>
								{:else}
									<Badge variant="destructive">Naughty</Badge>
								{/if}
							</Table.Cell>
							<Table.Cell class="text-right"></Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</main>
	</div>
	<div>
		<div class="rounded-lg border bg-card text-card-foreground shadow-sm">
			<Pagination count={10} page={page} onChange={handleClick} />
			<Pagination count={10} page={page} onChange={handleClick} siblingCount={0} />
			<Pagination count={10} page={page} onChange={handleClick} siblingCount={2} />
		</div>
	</div>
</div>
