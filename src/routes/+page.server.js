// Homepage. load returns the user's notes and categories; the create action backs
// the new-note form as a POST, so adding a note works even without JavaScript.
import { fail } from '@sveltejs/kit';
import { getNotes, getCategories, getCategory, createNote } from '$lib/db';
import { noteSchema } from '$lib/validation';
import clean from '$lib/sanitize';

export function load({ locals }) {
	if (!locals.user) {
		return { notes: [], categories: [] };
	}
	return {
		notes: getNotes(locals.user),
		categories: getCategories(locals.user)
	};
}

export const actions = {
	create: async ({ request, locals }) => {
		if (!locals.user) return fail(401, { error: 'You must be logged in to add a note' });

		const data = await request.formData();
		const form = { title: data.get('title'), body: data.get('body') };

		const parsed = noteSchema.safeParse(form);
		if (!parsed.success) {
			return fail(422, { error: parsed.error.issues[0].message });
		}

		const categoryValue = data.get('category_id');
		const categoryId = categoryValue ? Number(categoryValue) : null;
		if (categoryId !== null && !getCategory(categoryId, locals.user)) {
			return fail(422, { error: 'Please choose a valid category' });
		}

		createNote(locals.user, clean(parsed.data.title), clean(parsed.data.body), categoryId);
		return { success: true };
	}
};
