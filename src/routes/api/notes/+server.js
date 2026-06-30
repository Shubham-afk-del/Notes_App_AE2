// REST endpoints for the notes collection. Both require a logged-in user and only
// ever touch that user's own notes.
import { json } from '@sveltejs/kit';
import { getNotes, getNotesByCategory, getCategory, createNote } from '$lib/db';
import { noteSchema } from '$lib/validation';
import clean from '$lib/sanitize';

export function GET({ url, locals }) {
	// 401 unless signed in; an optional ?category= narrows the list to one category
	if (!locals.user) return json({ error: 'Not logged in' }, { status: 401 });

	const category = url.searchParams.get('category');
	const notes = category
		? getNotesByCategory(locals.user, Number(category))
		: getNotes(locals.user);

	return json(notes);
}

export async function POST({ request, locals }) {
	// reject anonymous callers, validate and sanitise the input, and make sure the
	// chosen category belongs to this user before inserting
	if (!locals.user) return json({ error: 'Not logged in' }, { status: 401 });

	const data = await request.json();
	const parsed = noteSchema.safeParse({ title: data.title, body: data.body });
	if (!parsed.success) {
		return json({ error: parsed.error.issues[0].message }, { status: 422 });
	}

	const categoryId = data.category_id ? Number(data.category_id) : null;
	if (categoryId !== null && !getCategory(categoryId, locals.user)) {
		return json({ error: 'Invalid category' }, { status: 422 });
	}

	const id = createNote(locals.user, clean(parsed.data.title), clean(parsed.data.body), categoryId);

	return json({ id }, { status: 201 });
}
