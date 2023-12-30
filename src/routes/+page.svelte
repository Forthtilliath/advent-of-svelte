<script lang="ts">
import type { PageData } from './$types';

export let data: PageData;
</script>

<div class="grid grid-cols-4 w-full gap-4 mt-10">
	{#each data.days as { day, title }}
		<a class="group" href="/days/{day}"
			><div
				class="rounded-lg border bg-card text-card-foreground shadow-sm group-hover:bg-muted/40 transition-colors ease-linear">
				<div class="flex flex-col space-y-1.5 p-6">
					<h3 class="text-lg font-semibold leading-none tracking-tight">Day {day}</h3>
					<p class="text-sm text-muted-foreground">{title}</p>
				</div>
			</div>
		</a>
	{/each}
</div>
