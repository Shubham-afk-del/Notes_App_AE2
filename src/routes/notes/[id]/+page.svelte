<script>
	export let data;

	async function saveEdit(event) {
		event.preventDefault();
		const fields = new FormData(event.target);
		const res = await fetch(`/api/notes/${data.note.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				title: fields.get('title'),
				body: fields.get('body'),
				category_id: fields.get('category_id')
			})
		});
		if (res.ok) {
			window.location.href = `/notes/${data.note.id}`;
		}
	}

	async function deleteNote(event) {
		event.preventDefault();
		const res = await fetch(`/api/notes/${data.note.id}`, { method: 'DELETE' });
		if (res.ok) {
			window.location.href = '/';
		}
	}
</script>

<svelte:head>
	<title>{data.note.title} - Notes App</title>
</svelte:head>

<nav class="breadcrumb" aria-label="Breadcrumb">
	<ul>
		<li><a href="/">Home</a></li>
		<li class="is-active">
			<a href="/notes/{data.note.id}" aria-current="page">{data.note.title}</a>
		</li>
	</ul>
</nav>

<article class="box">
	<h1 class="title">{data.note.title}</h1>
	<p style="white-space: pre-wrap;">{data.note.body}</p>
	<p class="is-size-7 has-text-grey mt-3">
		Last updated: {new Date(data.note.updated).toLocaleString()}
	</p>
</article>

<form class="box" on:submit={saveEdit}>
	<h2 class="subtitle">Edit note</h2>
	<div class="field">
		<label class="label" for="title">Title</label>
		<div class="control">
			<input
				class="input"
				id="title"
				name="title"
				type="text"
				required
				maxlength="100"
				value={data.note.title}
			/>
		</div>
	</div>
	<div class="field">
		<label class="label" for="body">Note</label>
		<div class="control">
			<textarea class="textarea" id="body" name="body" rows="6" required maxlength="5000"
				>{data.note.body}</textarea
			>
		</div>
	</div>
	<div class="field">
		<label class="label" for="category_id">Category</label>
		<div class="control">
			<div class="select">
				<select id="category_id" name="category_id">
					<option value="" selected={!data.note.category_id}>Uncategorised</option>
					{#each data.categories as category}
						<option value={category.id} selected={category.id === data.note.category_id}>
							{category.name}
						</option>
					{/each}
				</select>
			</div>
		</div>
	</div>
	<div class="control">
		<button class="button is-primary" type="submit">Save changes</button>
	</div>
</form>

<form class="box" on:submit={deleteNote}>
	<h2 class="subtitle">Delete note</h2>
	<p class="mb-3">This will permanently remove the note.</p>
	<button class="button is-danger" type="submit">Delete note</button>
</form>
