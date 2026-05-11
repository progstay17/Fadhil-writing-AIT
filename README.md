# AIT Writing for 潮际好麦

Web app to automatically generate product articles via LLM with tri-lingual UI (ZH / EN / ID).

## Features

- **Multi-lingual UI**: Support for Chinese, English, and Bahasa Indonesia.
- **AI-Powered Generation**: Optimized for product articles with SEO constraints.
- **Validation Rules**: Ensures word count, keyword density, and brand presence.
- **SEO Preview**: Live indicators for word count and keyword status.
- **Copy/Paste Tools**: One-click copy for article, meta, and slug.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API
- **I18n**: i18next & react-i18next

## Getting Started

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env.local` and add your `GEMINI_API_KEY`.
4. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment

This app is ready to be deployed on Vercel. Make sure to set the `GEMINI_API_KEY` environment variable in your Vercel project settings.

---
*for AIT from Fadhil Ghifarion 法迪*
