<script lang="ts">
import { Progress } from '$lib/components/ui/progress';

import ListDragAndDrop from './ListDragAndDrop.svelte';
import type { Present } from './schemas';

const { data } = $props();

let presents = $state({
	left: data.presents,
	sleigh: [] as Present[]
});

let weightSleigh = $derived(presents.sleigh.reduce((a, b) => a + b.weight, 0));
</script>

<div class="bg-card text-card-foreground shadow-sm p-6 space-y-6 m-auto">
	<header class="space-y-1.5">
		<h2 class="text-lg font-semibold leading-none tracking-tight">Sleigh Load Balancer</h2>
		<span class="mt-4 text-sm text-muted-foreground">
			A tool designed to ensure that the sleigh is packed efficiently without exceeding its maximum
			capacity
		</span>
	</header>

	<main>
		<Progress value={weightSleigh} />
	</main>

	<div class="grid grid-cols-2 gap-4">
		<div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-6">
			<header class="space-y-1.5">
				<h2 class="text-lg font-semibold leading-none tracking-tight">
					The children and the weight of their presents
				</h2>
			</header>
			<ListDragAndDrop bind:items={presents.left} />
		</div>

		<div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-6">
			<header class="space-y-1.5">
				<h2 class="text-lg font-semibold leading-none tracking-tight">
					Presents included in the sleigh
				</h2>
			</header>
			<ListDragAndDrop bind:items={presents.sleigh} />
		</div>
	</div>
</div>
