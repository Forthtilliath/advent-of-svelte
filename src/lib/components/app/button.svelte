<script lang="ts">
	import type { Snippet } from "svelte";

	type Props = {
		active?: boolean;
		disabled?: boolean;
		to: number;
		children: Snippet;
		onChange?: (event: MouseEvent, to: number) => void;
	};

	let {
		active = false,
		onChange = () => {},
		disabled = false,
		to,
		children
	} = $props<Props>();

	const buttonClass = $derived(active ? 'bg-green-500' : '');

	$effect(() => {
		if (!Number.isFinite(to)) {
			throw new Error('to is not a number');
		}
	});

	const handleChange = (event: MouseEvent) => {
		onChange(event, to);
	};
</script>

<button type="button" on:click={handleChange} class={buttonClass} {disabled}>
	{@render children()}
</button>
