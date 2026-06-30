import sanitizeHtml from 'sanitize-html';

// Notes are plain text, so strip all HTML tags and attributes before saving. This
// stops a stored note from injecting markup or a script when it is shown later
// (stored XSS).
export default function clean(dirty) {
	return sanitizeHtml(dirty, {
		allowedTags: [],
		allowedAttributes: {}
	});
}
