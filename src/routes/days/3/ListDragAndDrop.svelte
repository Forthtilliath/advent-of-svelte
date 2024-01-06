<script lang="ts">
import { dndzone } from 'svelte-dnd-action';
import { flip } from 'svelte/animate';

import Gift from './Gift.svelte';
import type { Present } from './schemas';

type Props = {
	items: Present[];
};

const flipDurationMs = 150;
let { items } = $props<Props>();

function handleDndConsiderCards(e: CustomEvent) {
	items = e.detail.items;
}
function handleDndFinalizeCards(e: CustomEvent) {
	items = e.detail.items;
}
</script>

<main
	class="grid [grid-template-columns:repeat(auto-fit,100px)] [grid-template-rows:repeat(auto-fill,100px)] gap-2 justify-center"
	use:dndzone={{ items, flipDurationMs }}
	on:consider={handleDndConsiderCards}
	on:finalize={handleDndFinalizeCards}>
	{#each items as { id, name, weight } (id)}
		<div class="border aspect-square" animate:flip={{ duration: flipDurationMs }}>
			{name} - {weight}kg
			<!-- <Gift /> -->
		</div>
	{/each}
</main>
