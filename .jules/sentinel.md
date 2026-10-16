## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2026-05-30 - Information Disclosure in API Error Handling
**Vulnerability:** Leaking raw SDK error messages to the client in `src/app/api/generate/route.ts`.
**Learning:** Error objects from external SDKs (like Google Generative AI) can contain sensitive internal details or stack traces in their message property.
**Prevention:** Explicitly map known errors to generic, safe messages and avoid returning `error.message` directly to the frontend.
