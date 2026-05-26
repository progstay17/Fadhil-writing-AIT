## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2025-05-20 - Information Leakage via Error Messages
**Vulnerability:** API error handlers were returning `error.message` directly to the client.
**Learning:** Raw error messages from SDKs (like Google Generative AI) can contain sensitive information about the environment, API usage, or internal state.
**Prevention:** Use a centralized error mapping function that returns generic, user-friendly messages for public-facing APIs, while logging the detailed error server-side.
