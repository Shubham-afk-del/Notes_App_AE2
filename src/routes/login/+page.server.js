// Login. Redirects away if already signed in. The same generic error is returned
// for a wrong username and a wrong password, so the form never reveals which
// usernames exist.
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { getUser } from '$lib/db';
import { login } from '$lib/auth';

export function load({ locals }) {
	if (locals.user) throw redirect(302, '/');
}

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');

		if (!username || !password) {
			return fail(422, { error: 'Please enter a username and password', username });
		}

		const user = getUser(username);
		if (user && (await bcrypt.compare(password, user.password))) {
			login(cookies, user.username);
			throw redirect(302, '/');
		}

		return fail(401, { error: 'Incorrect username or password', username });
	}
};
