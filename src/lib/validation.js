// Zod schemas for the forms. The messages are shown to the user, so they are
// written in plain English.
import { z } from 'zod';

export const userSchema = z.object({
	username: z
		.string()
		.trim()
		.min(3, { message: 'Username must be at least 3 characters' })
		.max(20, { message: 'Username must be 20 characters or fewer' })
		.regex(/^[a-zA-Z0-9_]+$/, {
			message: 'Username may only contain letters, numbers and underscores'
		}),
	password: z.string().min(5, { message: 'Password must be at least 5 characters' })
});

export const noteSchema = z.object({
	title: z
		.string()
		.trim()
		.min(1, { message: 'Please enter a title' })
		.max(100, { message: 'Title must be 100 characters or fewer' }),
	body: z
		.string()
		.trim()
		.min(1, { message: 'Please enter some text for your note' })
		.max(5000, { message: 'Note is too long (5000 characters maximum)' })
});

export const categorySchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, { message: 'Please enter a category name' })
		.max(50, { message: 'Category name must be 50 characters or fewer' })
});
