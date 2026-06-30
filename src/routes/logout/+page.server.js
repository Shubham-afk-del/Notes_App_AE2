import { redirect } from '@sveltejs/kit';
import { logout } from '$lib/auth';

export const actions = {
	default: ({ cookies }) => {
		logout(cookies);
		throw redirect(302, '/');
	}
};
