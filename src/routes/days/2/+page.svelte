<script lang="ts">
import Button from '$lib/components/ui/button/button.svelte';
import { createCounter } from '$lib/hooks/createCounter';

let cookiesMunched = $state(0);
const counter = createCounter((v) => (cookiesMunched = v), 0);
</script>

<div
	class="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-6 order-2 lg:order-1">
	<header class="space-y-1.5">
		<h2 class="text-lg font-semibold leading-none tracking-tight">Merry Munch-o-Meter</h2>
		<span class="mt-4 text-sm text-muted-foreground">
			Keep track of how many cookies Santa has munched
		</span>
	</header>

	<main>
		<p class="text-5xl font-bold">{cookiesMunched}</p>
		<Button on:click={() => counter.decrement()}>Remove</Button>
		<Button on:click={() => counter.reset()}>Reset</Button>
		<Button on:click={() => counter.increment()}>Add</Button>
	</main>
</div>
