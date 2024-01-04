<script lang="ts">
import Button from '$lib/components/ui/button/button.svelte';
import { createCounter } from '$lib/hooks/createCounter.svelte';

const cookiesMunched = createCounter({ min: 0 });
const disabled = $derived(cookiesMunched.value === 0);
</script>

<div
	class="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-6 max-w-3xl m-auto">
	<header class="space-y-1.5">
		<h2 class="text-lg font-semibold leading-none tracking-tight">Merry Munch-o-Meter</h2>
		<span class="mt-4 text-sm text-muted-foreground">
			Keep track of how many cookies Santa has munched
		</span>
	</header>

	<main>
		<h3 class="text-lg font-semibold leading-none tracking-tight">Cookies eaten:</h3>
		<p class="text-5xl font-bold my-2">{cookiesMunched.value}</p>
		<Button on:click={cookiesMunched.decrement} {disabled}>Remove</Button>
		<Button on:click={cookiesMunched.reset} {disabled}>Reset</Button>
		<Button on:click={cookiesMunched.increment}>Add</Button>
	</main>
</div>
