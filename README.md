# Unifor Biblioteca — mobile app

Mobile app of the **Unifor Biblioteca** project: a university library app with two
profiles, **student** (searches the catalog, requests loans, joins queues, picks up
books with a QR code) and **librarian** (desk: pickups, returns, fines and queues).

Built with Expo (React Native) and TypeScript. The app never talks to Firestore: every
piece of data comes from the REST API ([`unifor-biblioteca-api`](https://github.com/gustavuhh1/unifor-biblioteca-api)).
The only direct Firebase use is Firebase Authentication (password login, session and
`signInWithCustomToken` after a passkey login).

> The user interface is in Brazilian Portuguese. Code, commit messages and this README
> follow the course rules: code and README in English, commits and code comments in
> Portuguese.

## Status

This branch is the project foundation: structure, design-system theme (light and dark),
API client, session (password and passkey login, logout), the base components
(`Button`, `TextField`, `AppBar`, `Icon`, `BottomNav`) and placeholder screens for every
tab. The real screens come in the next tasks.

## Requirements

- Node 24 and npm.
- JDK 17 or newer and the Android SDK (`ANDROID_HOME` set), with an Android emulator
  (Pixel 6a, API 34, Google Play image) or a physical device.
- The API running locally with the Firebase Emulator Suite (see the API README).
- Passkeys do **not** run in Expo Go: use a development build (`expo run:android`).
  The emulator needs a Google account signed in and a screen lock (PIN), so Credential
  Manager can create passkeys.

## Run

1. Start the API side (in the API repository): `npm run emulators`, `npm run seed` and
   `npm run dev` (port 8080).
2. Create the local `.env` from the example and fill it in:

   ```sh
   cp .env.example .env
   ```

   For the emulator you only need:

   ```text
   EXPO_PUBLIC_API_URL=http://10.0.2.2:8080
   EXPO_PUBLIC_USE_EMULATORS=true
   ```

   On the Android emulator the computer is `10.0.2.2`: the API is at `:8080` and the
   Auth emulator at `:9099`.
3. Install and run:

   ```sh
   npm install
   npx expo run:android   # prebuild + Gradle build + install on the open emulator
   ```

   Later runs can use `npm start` (Metro with the dev client) once the app is installed.

### Environment variables

Only names are versioned (`.env.example`); values live in the local `.env` (ignored by Git).

| Variable | Purpose |
| --- | --- |
| `EXPO_PUBLIC_API_URL` | API base URL (required) |
| `EXPO_PUBLIC_USE_EMULATORS` | `true` connects to the Firebase Auth emulator |
| `EXPO_PUBLIC_AUTH_EMULATOR_URL` | Auth emulator URL (default `http://10.0.2.2:9099`) |
| `EXPO_PUBLIC_FIREBASE_API_KEY`, `_AUTH_DOMAIN`, `_PROJECT_ID`, `_APP_ID` | Public Firebase web config (required outside the emulator) |
| `UNIBOOKS_KEYSTORE_PATH`, `UNIBOOKS_KEYSTORE_PASSWORD`, `UNIBOOKS_KEY_ALIAS`, `UNIBOOKS_KEY_PASSWORD` | Own Android signing key (see below) |

Variables are validated with Zod at startup (`src/shared/config`).

## Android signing key and passkeys

Passkeys only work when the app's signing certificate is listed in the
`assetlinks.json` served at `https://uni-books.app/.well-known/assetlinks.json`
(RP ID `uni-books.app`). The Expo default `debug.keystore` is public, so the
development build is signed with the project's own keystore, kept **outside** the
repository.

- The config plugin `plugins/with-dev-signing.js` patches `android/app/build.gradle`
  on every `prebuild`, so the signing survives regenerating the `android/` folder.
  Gradle reads the keystore from the `UNIBOOKS_*` environment variables at build time
  (nothing is written to the generated files).
- Without those variables the build falls back to the public debug key and prints a
  warning: the app runs, but passkeys will not work.
- Create the keystore once with `keytool -genkeypair` (keep it and its passwords out of
  Git), then fill the `UNIBOOKS_*` variables in `.env`.

SHA-256 of the certificate:

```sh
keytool -list -v -keystore <keystore> -alias <alias>
```

The API variable `PASSKEY_ANDROID_ORIGINS` takes `android:apk-key-hash:<SHA-256 as base64url, no "=">`:

```sh
node -e "console.log(Buffer.from(process.argv[1].replace(/:/g,''),'hex').toString('base64url'))" <SHA-256>
```

## Design system and theme

The visual identity comes from `docs/design-system/tokens.json`. Never write colors,
spacing, radii or font sizes by hand: use the generated Tailwind classes
(`bg-surface`, `text-ink`, `p-4`, `rounded-md`, `text-body`, `text-book-title`...).

```sh
npm run tokens   # regenerates tailwind.config.js, src/global.css and src/shared/theme/*.generated.ts
```

- `tailwind.config.js` **replaces** (not extends) the Tailwind theme, so no class outside
  the design system exists.
- `src/global.css` holds the CSS variables of each token in the light and dark themes.
- The theme follows the phone; the Appearance screen can force Light, Dark or "same as
  phone" (stored in AsyncStorage).
- Shadows are TypeScript tokens (`useTheme().shadows`) because NativeWind cannot build
  multi-layer shadows.
- Fonts (Figtree and Newsreader) are loaded in `src/app/_layout.tsx`.

## Project structure

```text
src/
  app/                  Expo Router routes only (thin files that mount a feature screen)
    (auth)/             login (sign-up and recovery come later)
    (student)/          tabs: Home, Catalog, Loans, Assistant, Profile
    (librarian)/        tabs: Panel, Withdrawals, Scan, Queues, Fines
  features/<feature>/   auth, catalog, loans, queues, fines, desk, saved,
                        notifications, assistant, profile
                        (screens, components, api, hooks, schemas, __tests__)
  shared/
    api/                single HTTP client (ID token, base URL, typed API errors)
    components/         design-system components
    config/             validated env and Firebase setup
    theme/              tokens in TS, theme provider
    types/              mirror of unifor-biblioteca-api/src/shared/types
    hooks/ utils/
docs/                   project documents (source of truth) and design system
scripts/                generate-tokens.mjs
plugins/                Expo config plugins
```

## Commands

| Command | What it does |
| --- | --- |
| `npx expo run:android` | development build on the emulator/device |
| `npm start` | Metro with the dev client |
| `npm run typecheck` | TypeScript (`strict`) |
| `npm run lint` / `npm run format` | ESLint and Prettier |
| `npm test` | unit tests (Jest with `jest-expo`) |
| `npm run tokens` | regenerate theme files from the design-system tokens |

## Notes

- Sample data (books, dates, histories) is fictional; the library does not provide real data.
- The Gemini API (free plan) may use prompts to improve Google products: only fictional
  data goes through the Assistant.
