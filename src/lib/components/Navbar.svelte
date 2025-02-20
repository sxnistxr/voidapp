<script>
	import { LucideHome, Search, Settings } from 'lucide-svelte';
</script>

<div class="sticky top-0 flex h-screen flex-col justify-between rounded-r-xl bg-neutral-800">
	<div>
		<div class="border-b border-b-neutral-600 bg-neutral-900/40 p-1">
			<h1 class="mx-10 mt-1 mb-1 rounded-full px-5 py-1 text-2xl text-neutral-300">
				Void<span class="text-red-500">App</span>
			</h1>
		</div>

		<div class="flex flex-col gap-2 px-2 py-2">
			<a
				href="/"
				class="flex items-center gap-4 rounded-full border border-neutral-600/40 bg-neutral-600/60 px-1 py-1 text-center text-xl"
			>
				<LucideHome size="30px" color="#fff" class="rounded-lg bg-neutral-700/60 p-1" />
				Home
			</a>
			<a
				href="/search"
				class="flex items-center gap-4 rounded-full px-1 py-1 text-center text-xl hover:bg-neutral-600/40"
			>
				<Search size="30px" color="#fff" class="rounded-lg bg-neutral-700/60 p-1" />
				Search
			</a>
			<a
				href="/settings"
				class="flex items-center gap-4 rounded-full px-1 py-1 text-center text-xl hover:bg-neutral-600/40"
			>
				<Settings size="30px" color="#fff" class="rounded-lg bg-neutral-700/60 p-1" />
				Settings
			</a>
		</div>
	</div>
</div>
