// Settings page (protected). Adds and removes the user's categories, and lets
// the signed-in user delete their own account. Removing a category keeps its
// notes; the database layer just detaches them. Account deletion is permanent
// and removes the user's notes and categories along with the user row.
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import {
	getCategories,
	createCategory,
	deleteCategory,
	getUser,
	updateUserPassword,
	deleteUser
} from '$lib/db';
import { categorySchema, userSchema } from '$lib/validation';
import clean from '$lib/sanitize';
import { logout } from '$lib/auth';

export function load({ locals }) {
	if (!locals.user) throw redirect(302, '/login');
	return { categories: getCategories(locals.user) };
}

export const actions = {
	addCategory: async ({ request, locals }) => {
		if (!locals.user) throw redirect(302, '/login');

		const data = await request.formData();
		const parsed = categorySchema.safeParse({ name: data.get('name') });
		if (!parsed.success) {
			return fail(422, { error: parsed.error.issues[0].message });
		}

		createCategory(locals.user, clean(parsed.data.name));
		return { success: true };
	},

	removeCategory: async ({ request, locals }) => {
		if (!locals.user) throw redirect(302, '/login');

		const data = await request.formData();
		const id = Number(data.get('id'));
		deleteCategory(id, locals.user);
	},

	resetPassword: async ({ request, locals }) => {
		if (!locals.user) throw redirect(302, '/login');

		const data = await request.formData();
		const current = data.get('current');
		const newPassword = data.get('newPassword');
		const confirm = data.get('confirm');

		if (!current) {
			return fail(422, { passwordError: 'Please enter your current password' });
		}

		const parsed = userSchema.safeParse({ username: locals.user, password: newPassword });
		if (!parsed.success) {
			return fail(422, { passwordError: parsed.error.issues[0].message });
		}

		if (newPassword !== confirm) {
			return fail(422, { passwordError: 'The two new passwords do not match' });
		}

		const user = getUser(locals.user);
		if (!user || !(await bcrypt.compare(current, user.password))) {
			return fail(401, { passwordError: 'Current password is incorrect' });
		}

		if (await bcrypt.compare(newPassword, user.password)) {
			return fail(422, { passwordError: 'New password must be different from the current one' });
		}

		const hash = await bcrypt.hash(parsed.data.password, 12);
		updateUserPassword(locals.user, hash);
		return { passwordSuccess: true };
	},

	deleteAccount: async ({ request, cookies, locals }) => {
		if (!locals.user) throw redirect(302, '/login');

		const data = await request.formData();
		const password = data.get('password');
		const confirm = data.get('confirm');

		if (!password) {
			return fail(422, { deleteError: 'Please enter your password to confirm' });
		}

		if (confirm !== 'DELETE') {
			return fail(422, { deleteError: 'Type DELETE in the confirmation box to continue' });
		}

		const user = getUser(locals.user);
		if (!user || !(await bcrypt.compare(password, user.password))) {
			return fail(401, { deleteError: 'Password is incorrect' });
		}

		deleteUser(locals.user);
		logout(cookies);
		throw redirect(303, '/?deleted=1');
	}
};
