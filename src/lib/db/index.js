// Database access layer: opens the SQLite file and defines every query the app
// uses. Each note and category query is filtered by the owner's username, so a
// user can only read or change their own data.
import Database from 'better-sqlite3';

const db = new Database('./data/notes.db'); // the file is created on first run
db.pragma('journal_mode = WAL'); // write-ahead logging: better read/write concurrency

process.on('exit', () => db.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));

db.prepare(
	`CREATE TABLE IF NOT EXISTS users (
		username TEXT PRIMARY KEY,
		password TEXT NOT NULL
	)`
).run();

db.prepare(
	`CREATE TABLE IF NOT EXISTS categories (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user TEXT NOT NULL,
		name TEXT NOT NULL
	)`
).run();

db.prepare(
	`CREATE TABLE IF NOT EXISTS notes (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user TEXT NOT NULL,
		title TEXT NOT NULL,
		body TEXT NOT NULL,
		category_id INTEGER,
		created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	)`
).run();

export function getUser(username) {
	const sql = `SELECT * FROM users WHERE username = $username`;
	return db.prepare(sql).get({ username: username.toLowerCase() });
}

export function createUser(username, password) {
	const sql = `INSERT INTO users (username, password) VALUES ($username, $password)`;
	return db.prepare(sql).run({ username: username.toLowerCase(), password });
}

export function updateUserPassword(username, password) {
	const sql = `UPDATE users SET password = $password WHERE username = $username`;
	return db.prepare(sql).run({ username: username.toLowerCase(), password });
}

export const deleteUser = db.transaction((username) => {
	const user = username.toLowerCase();
	db.prepare(`DELETE FROM notes WHERE user = $user`).run({ user });
	db.prepare(`DELETE FROM categories WHERE user = $user`).run({ user });
	db.prepare(`DELETE FROM users WHERE username = $user`).run({ user });
});

export function getCategories(user) {
	const sql = `SELECT * FROM categories WHERE user = $user ORDER BY name`;
	return db.prepare(sql).all({ user });
}

export function getCategory(id, user) {
	const sql = `SELECT * FROM categories WHERE id = $id AND user = $user`;
	return db.prepare(sql).get({ id, user });
}

export function createCategory(user, name) {
	const sql = `INSERT INTO categories (user, name) VALUES ($user, $name)`;
	return db.prepare(sql).run({ user, name });
}

export function deleteCategory(id, user) {
	// removing a category must not delete its notes: detach them (set to NULL) first
	db.prepare(`UPDATE notes SET category_id = NULL WHERE category_id = $id AND user = $user`).run({
		id,
		user
	});
	const sql = `DELETE FROM categories WHERE id = $id AND user = $user`;
	return db.prepare(sql).run({ id, user });
}

export function getNotes(user) {
	const sql = `SELECT * FROM notes WHERE user = $user ORDER BY updated DESC`;
	return db.prepare(sql).all({ user });
}

export function getNotesByCategory(user, categoryId) {
	const sql = `SELECT * FROM notes WHERE user = $user AND category_id = $categoryId ORDER BY updated DESC`;
	return db.prepare(sql).all({ user, categoryId });
}

export function getNote(id, user) {
	const sql = `SELECT * FROM notes WHERE id = $id AND user = $user`;
	return db.prepare(sql).get({ id, user });
}

export function createNote(user, title, body, categoryId) {
	const sql = `INSERT INTO notes (user, title, body, category_id)
		VALUES ($user, $title, $body, $categoryId)`;
	const info = db.prepare(sql).run({ user, title, body, categoryId: categoryId ?? null });
	return info.lastInsertRowid;
}

export function updateNote(id, user, title, body, categoryId) {
	const sql = `UPDATE notes
		SET title = $title, body = $body, category_id = $categoryId, updated = CURRENT_TIMESTAMP
		WHERE id = $id AND user = $user`;
	return db.prepare(sql).run({ id, user, title, body, categoryId: categoryId ?? null });
}

export function deleteNote(id, user) {
	const sql = `DELETE FROM notes WHERE id = $id AND user = $user`;
	return db.prepare(sql).run({ id, user });
}
