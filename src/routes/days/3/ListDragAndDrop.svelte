<script lang="ts">
import { dndzone, type Item } from 'svelte-dnd-action';
import { flip } from 'svelte/animate';

type Props = {
	items: Item[];
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
	class="grid [grid-template-columns:repeat(auto-fit,minmax(100px,1fr))] [grid-template-rows:repeat(auto-fill,minmax(100px,1fr))]"
	use:dndzone={{ items, flipDurationMs }}
	on:consider={handleDndConsiderCards}
	on:finalize={handleDndFinalizeCards}>
	{#each items as { id, name, weight } (id)}
		<div class="border aspect-square" animate:flip={{ duration: flipDurationMs }}>
			{name} - {weight}kg
		</div>
	{/each}
</main>
