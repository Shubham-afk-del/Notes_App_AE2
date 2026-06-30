// Forgot password. Validates the username and new password, looks the user up
// and writes a fresh bcrypt hash (cost 12) into the users table. The same
// generic error is returned whether the user is missing or the input is bad,
// so the form never reveals which usernames exist.
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { getUser, updateUserPassword } from '$lib/db';
import { userSchema } from '$lib/validation';

export function load({ locals }) {
	if (locals.user) throw redirect(302, '/');
}

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');
		const confirm = data.get('confirm');

		const parsed = userSchema.safeParse({ username, password });
		if (!parsed.success) {
			return fail(422, { error: parsed.error.issues[0].message, username });
		}

		if (password !== confirm) {
			return fail(422, { error: 'The two passwords do not match', username });
		}

		const user = getUser(parsed.data.username);
		if (!user) {
			return fail(404, { error: 'No account found with that username', username });
		}

		const hash = await bcrypt.hash(parsed.data.password, 12);
		updateUserPassword(parsed.data.username, hash);

		throw redirect(303, '/login?reset=1');
	}
};
