import 'dotenv/config';
import jwt from 'jsonwebtoken';

// httpOnly keeps the token out of reach of page JavaScript (helps against XSS),
// secure sends it over HTTPS only, and sameSite 'strict' stops it being sent on
// cross-site requests (helps against CSRF). It lasts one day, like the token.
const COOKIE_OPTIONS = {
	httpOnly: true,
	secure: true,
	sameSite: 'strict',
	maxAge: 60 * 60 * 24,
	path: '/'
};

export function login(cookies, username) {
	const token = jwt.sign({ id: username }, process.env.JWT_TOKEN, { expiresIn: '1d' });
	cookies.set('Token', `Bearer ${token}`, COOKIE_OPTIONS);
}

export function logout(cookies) {
	cookies.set('Token', 'Bearer ', { path: '/', maxAge: 0 });
}
