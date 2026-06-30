// Registration. Validates the input, rejects a name that is already taken, hashes
// the password with bcrypt (cost 12) and signs the new user straight in.
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { getUser, createUser } from '$lib/db';
import { userSchema } from '$lib/validation';
import { login } from '$lib/auth';

export function load({ locals }) {
	if (locals.user) throw redirect(302, '/');
}

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const form = { username: data.get('username'), password: data.get('password') };

		const parsed = userSchema.safeParse(form);
		if (!parsed.success) {
			return fail(422, { error: parsed.error.issues[0].message, username: form.username });
		}

		if (getUser(parsed.data.username)) {
			return fail(409, { error: 'That username is already taken', username: form.username });
		}

		const hash = await bcrypt.hash(parsed.data.password, 12);
		createUser(parsed.data.username, hash);

		login(cookies, parsed.data.username.toLowerCase());
		throw redirect(302, '/');
	}
};
