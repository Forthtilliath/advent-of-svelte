<script lang="ts">
import Footer from '$lib/components/layout/footer.svelte';
import Header from '$lib/components/layout/header.svelte';

import '../app.pcss';

let { children } = $props();
</script>

<svelte:head>
	<title>Advent of Svelte 2023</title>
</svelte:head>

<div class="flex flex-col container min-h-dvh">
	<Header />
	<main class="flex-grow mt-6">
		{@render children()}
	</main>
	<Footer />
</div>
