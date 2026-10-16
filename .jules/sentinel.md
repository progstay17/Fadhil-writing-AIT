## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2025-05-20 - Unsanitized Username in Env Lookup
**Vulnerability:** User-provided `username` was used directly to construct keys for `process.env` lookups in `src/app/api/auth/login/route.ts`.
**Learning:** Even if an environment seems "safe", using unsanitized user input as an identifier for looking up sensitive data (like passwords or API keys) can lead to unexpected behavior or information disclosure.
**Prevention:** Always validate and sanitize identifiers derived from user input before using them to access configuration or environment objects. Use a strict whitelist (e.g., alphanumeric regex) for such identifiers.
