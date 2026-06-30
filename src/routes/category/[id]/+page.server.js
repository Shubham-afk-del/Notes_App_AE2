// Category page (protected). Lists the notes in one of the user's categories and
// 404s if the category id does not belong to them.
import { error, redirect } from '@sveltejs/kit';
import { getCategory, getNotesByCategory } from '$lib/db';

export function load({ params, locals }) {
	if (!locals.user) throw redirect(302, '/login');

	const id = Number(params.id);
	const category = getCategory(id, locals.user);
	if (!category) throw error(404, 'Category not found');

	return {
		category,
		notes: getNotesByCategory(locals.user, id)
	};
}
