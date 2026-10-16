# AIT Writing for 潮际好麦

A multilingual web application for generating product articles with an LLM, with Chinese, English, and Bahasa Indonesia UI. It includes article-generation modes, SEO-oriented validation, preview indicators, and copy tools.

## Features

- Tri-lingual interface: Chinese, English, and Indonesian.
- AI-assisted product-article generation using Google Gemini.
- Validation for word count, keywords, and brand presence.
- SEO preview indicators.
- Copy tools for article text, metadata, and slug.

## Tech stack

- Next.js App Router, React, and TypeScript
- Tailwind CSS
- Google Generative AI SDK
- i18next / react-i18next
- Vitest and Testing Library for tests

## Requirements

- Node.js compatible with the installed Next.js version
- A Gemini API key
- A strong JWT signing secret (at least 32 characters)

## Local setup

```bash
npm install
```

Create a `.env.local` file in the repository root (it is ignored by Git) and set:

```dotenv
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=replace_with_a_random_secret_at_least_32_characters
```

Use real values only in your local environment or hosting provider's secret settings. Never commit API keys or JWT secrets.

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000.

## Quality checks

```bash
npm run lint
npm run build
```

Tests are configured with Vitest. Run the project's test command only after one is added to `package.json`; the current scripts expose `dev`, `build`, `start`, and `lint`.

## Deployment

Deploy as a Next.js application on a compatible host such as Vercel. Configure `GEMINI_API_KEY` and `JWT_SECRET` in the host's environment-variable settings before serving the app.

---

Built for AIT by Fadhil Ghifarion 法迪.
