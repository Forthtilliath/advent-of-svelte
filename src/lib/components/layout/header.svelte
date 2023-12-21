<script>
	import Github from '../icons/github.svelte';
</script>

<header class="sticky top-0 supports-[backdrop-filter]:bg-background/90 h-14 bg-background/95">
	<div class="h-full flex items-center justify-between">
		<a href="/"><span class="font-bold text-lg">Advent of Svelte 2023</span></a>
		<div>
			<a href="https://github.com/Forthtilliath" target="_blank" rel="noreferrer" class="p-2 text-sm h-9 w-9 flex hover:bg-slate-50/10 rounded-sm">
				<Github />
				<span class="sr-only">GitHub</span>
			</a>
		</div>
	</div>

	<div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 custom-border" />
</header>

<style>
	.custom-border {
		height: 1px;
		--bg-color: hsla(0, 0%, 100%, 0.6);
		background: var(--bg-color);
		box-shadow: 0 0 0 100vmax var(--bg-color);
		clip-path: inset(0 -100vmax);
	}
</style>
