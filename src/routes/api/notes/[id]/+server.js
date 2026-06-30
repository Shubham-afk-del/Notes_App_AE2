// REST endpoints for a single note. Each handler 404s if the note is missing or
// belongs to someone else, so note ids can't be probed by other users.
import { json } from '@sveltejs/kit';
import { getNote, getCategory, updateNote, deleteNote } from '$lib/db';
import { noteSchema } from '$lib/validation';
import clean from '$lib/sanitize';

export function GET({ params, locals }) {
	if (!locals.user) return json({ error: 'Not logged in' }, { status: 401 });

	const note = getNote(Number(params.id), locals.user);
	if (!note) return json({ error: 'Not found' }, { status: 404 });

	return json(note);
}

export async function PUT({ params, request, locals }) {
	// same validate, sanitise and category-ownership checks as creating a note
	if (!locals.user) return json({ error: 'Not logged in' }, { status: 401 });

	const id = Number(params.id);
	if (!getNote(id, locals.user)) return json({ error: 'Not found' }, { status: 404 });

	const data = await request.json();
	const parsed = noteSchema.safeParse({ title: data.title, body: data.body });
	if (!parsed.success) {
		return json({ error: parsed.error.issues[0].message }, { status: 422 });
	}

	const categoryId = data.category_id ? Number(data.category_id) : null;
	if (categoryId !== null && !getCategory(categoryId, locals.user)) {
		return json({ error: 'Invalid category' }, { status: 422 });
	}

	updateNote(id, locals.user, clean(parsed.data.title), clean(parsed.data.body), categoryId);

	return json({ success: true });
}

export function DELETE({ params, locals }) {
	if (!locals.user) return json({ error: 'Not logged in' }, { status: 401 });

	const id = Number(params.id);
	if (!getNote(id, locals.user)) return json({ error: 'Not found' }, { status: 404 });

	deleteNote(id, locals.user);

	return json({ success: true });
}
