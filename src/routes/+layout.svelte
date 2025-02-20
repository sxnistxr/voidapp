<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import '../app.css';
	let { children } = $props();
</script>

<div class="flex flex-row gap-2">
	<Navbar />
	<main>{@render children()}</main>
</div>
