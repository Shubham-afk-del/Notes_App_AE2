// Individual note page (protected). Loads the note plus the user's categories for
// the edit form; redirects anonymous users to /login and 404s on a note that
// isn't theirs.
import { error, redirect } from '@sveltejs/kit';
import { getNote, getCategories } from '$lib/db';

export function load({ params, locals }) {
	if (!locals.user) throw redirect(302, '/login');

	const note = getNote(Number(params.id), locals.user);
	if (!note) throw error(404, 'Note not found');

	return {
		note,
		categories: getCategories(locals.user)
	};
}
