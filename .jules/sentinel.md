## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2025-05-16 - Raw Error Information Disclosure
**Vulnerability:** Leaking raw `error.message` to the client in `src/app/api/generate/route.ts`.
**Learning:** Raw error messages from libraries (like `@google/generative-ai`) can expose internal state or API details that aid attackers.
**Prevention:** Map exceptions to safe, generic user-facing messages and ensure detailed logs are restricted to the server environment.
