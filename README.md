# Notes App

A note-taking web application for the **LCSCI7224 Web Services (AE2)** coursework.
Users can register, log in, write plain-text notes, organise them into
categories, and edit, recategorise or delete them.

It is built with **SvelteKit** (a full-stack JavaScript framework) and **SQLite**
via **better-sqlite3**.

---

## Requirements

- [Node.js](https://nodejs.org/) (version 18 or newer) and npm.

`better-sqlite3` and `bcrypt` are compiled when you install, so the first
`npm install` may take a minute.

## How to run

```bash
# 1. Install the dependencies
npm install

# 2. Create your environment file (holds the secret used to sign session tokens)
cp .env.example .env

# 3. Start the development server
npm run dev
```

Then open the URL printed in the terminal (by default
<http://localhost:5173>). The SQLite database file is created automatically at
`data/notes.db` the first time the app runs - there is no separate setup step.

To build and preview a production version:

```bash
npm run build
npm run preview
```

To format the source code with Prettier:

```bash
npm run format
```

## How to use

1. Open the homepage. While logged out you see generic information and links to
   **Log in** / **Register**.
2. **Register** a new account (or log in). You are taken to your homepage.
3. On the homepage, write a note with the **New note** form. Choose a category
   if you have created one.
4. Click a note's title to open the **note page**, where you can edit it,
   move it to a different category, or delete it.
5. Open **Settings** to add or remove categories.
6. Click a category (on the homepage or in Settings) to see the **category
   page** listing only that category's notes.
7. On the Settings page you can switch between a **Day** and **Night** theme.
   Your choice is saved in the browser, so it stays after a refresh.
8. On the Settings page you can also **Reset password** (current password +
   new password) and **Delete account** (permanent removal of your user,
   notes and categories; requires your password plus typing `DELETE`).
9. If you have forgotten your password, follow the **Forgot password?** link
   on the Login page to set a new one from `/forgot-password`.

## Account management

Three flows let a user manage their own account.

| Flow             | Where                                       | Verifies                                | Updates                                              |
| ---------------- | ------------------------------------------- | --------------------------------------- | ---------------------------------------------------- |
| Forgot password  | `/forgot-password` (link on the login page) | username exists; new password matches confirm | replaces the bcrypt hash, redirects to `/login?reset=1` |
| Reset password   | `/settings` -> "Reset password" form        | current password (bcrypt compare); new password meets `userSchema`; new differs from current | replaces the bcrypt hash, shows "Password updated."  |
| Delete account   | `/settings` -> "Delete account" form        | current password (bcrypt compare); confirm field equals literal `DELETE` | deletes notes + categories + user in one SQL transaction, clears the session cookie, redirects to `/?deleted=1` |

Each flow re-uses `userSchema` and `bcrypt.hash(..., 12)` so the password rules
are the same as registration. Account deletion uses `db.transaction(...)` from
better-sqlite3 so the three `DELETE` statements either all succeed or none do.

There is **no email-based password reset**: the project has no SMTP credentials
in scope, so the forgot-password flow takes the username and a new password
directly. This is acceptable for the coursework demo; a real product would
send a one-time reset link instead.

## The five pages (assessment requirement)

| Page                 | Route                    |
| -------------------- | ------------------------ |
| Homepage             | `/`                      |
| Login / Registration | `/login` and `/register` |
| Category             | `/category/[id]`         |
| Individual note      | `/notes/[id]`            |
| Settings             | `/settings`              |

There are also three simple info pages linked from the footer: **Help** (`/help`),
**About** (`/about`) and **Contact** (`/contact`), plus a **Forgot password**
page (`/forgot-password`) reached from the Login page.

## Theme and images

- The day/night theme uses Bulma's built-in `data-theme` attribute. A small
  script in `src/app.html` reads the saved choice from `localStorage` and the
  Settings page lets the user change it.
- The homepage and login backgrounds are local images in `static/images/`
  (`hero.svg` and `login.svg`). To use your own photo instead, drop a landscape
  image in `static/images/` and update the `url(...)` in `src/lib/app.css`. A
  fallback background colour is set in case an image fails to load.
- Once logged in, the pages show a soft background image that follows the theme:
  `static/images/app-light.svg` (day) and `app-dark.svg` (night), applied via the
  `.app-bg` class on `<main>`.

## HTTP verbs and parameters

CRUD is mapped to HTTP verbs:

- **Read** - page `load` functions (GET) and `GET /api/notes`
- **Create** - `POST` form actions (new note, register, add category)
- **Update / recategorise** - `PUT /api/notes/[id]`
- **Delete** - `DELETE /api/notes/[id]`

Path parameters identify a resource (`/notes/3`, `/category/2`); the query
parameter `GET /api/notes?category=2` filters the list.

## Project structure

```
notes-app/
├── data/                       SQLite database file lives here (auto-created)
├── src/
│   ├── app.html                page shell (lang + responsive viewport)
│   ├── hooks.server.js         verifies the JWT cookie on every request
│   ├── lib/
│   │   ├── app.css             Bulma import + accessibility styles
│   │   ├── auth.js             JWT sign / cookie helpers
│   │   ├── sanitize.js         sanitize-html wrapper
│   │   ├── validation.js       Zod form schemas
│   │   ├── db/index.js         better-sqlite3 connection + all SQL queries
│   │   └── components/         Nav.svelte, NoteCard.svelte
│   └── routes/
│       ├── +layout.svelte      header / nav / footer + <slot/>
│       ├── +layout.server.js   exposes the logged-in user to every page
│       ├── +page.svelte/.js    homepage
│       ├── login/  register/  logout/
│       ├── forgot-password/   reset password from a username (no email needed)
│       ├── category/[id]/      category page
│       ├── notes/[id]/         individual note page
│       ├── settings/           theme, categories, reset password, delete account
│       └── api/notes/          REST endpoints (GET/POST/PUT/DELETE)
├── .env.example                copy to .env before running
└── svelte.config.js / vite.config.js
```

## Technologies used

| Technology     | Purpose                                     |
| -------------- | ------------------------------------------- |
| SvelteKit      | full-stack framework, routing, server logic |
| better-sqlite3 | SQLite database access                      |
| jsonwebtoken   | JWT session tokens                          |
| bcrypt         | password hashing                            |
| zod            | form validation                             |
| sanitize-html  | strip HTML from input (anti-XSS)            |
| dotenv         | read the token secret from `.env`           |
| Bulma          | responsive CSS framework                    |
| Prettier       | code formatting                             |
