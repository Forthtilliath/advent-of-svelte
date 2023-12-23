<script lang="ts">
	import { cn } from "$lib/utils";
	import { badgeVariants, type Variant, type Space } from ".";

	let className: string | undefined | null = undefined;
	export let href: string | undefined = undefined;
	export let variant: Variant = "default";
	export let space: Space = "default";
	export { className as class };
</script>

<svelte:element
	this={href ? "a" : "span"}
	{href}
	class={cn(badgeVariants({ variant,space, className }))}
	{...$$restProps}
>
	<slot />
</svelte:element>
