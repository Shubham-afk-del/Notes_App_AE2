// Runs before every request. It reads the session cookie, verifies the JWT and
// stores the username on event.locals so pages and API routes know who is signed
// in. A bad or expired token is cleared.
import 'dotenv/config';
import jwt from 'jsonwebtoken';

export async function handle({ event, resolve }) {
	const authCookie = event.cookies.get('Token');

	if (authCookie) {
		const token = authCookie.split(' ')[1];
		try {
			const payload = jwt.verify(token, process.env.JWT_TOKEN);
			event.locals.user = payload?.id;
		} catch (error) {
			console.log('JWT Error:', error);
			event.cookies.set('Token', 'Bearer ', { path: '/', maxAge: 0 });
			delete event.locals.user;
		}
	}

	return resolve(event);
}
