## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2025-05-16 - Dynamic Property Access Injection
**Vulnerability:** User-provided input used directly as a key for `process.env` lookup in `src/app/api/auth/login/route.ts`.
**Learning:** Using untrusted input to access properties of global objects like `process.env` can lead to unintended data exposure or configuration bypass if not strictly validated.
**Prevention:** Always validate and sanitize any input used for dynamic property access. Use a whitelist or strict regex (e.g., alphanumeric only) to restrict keys to expected patterns.
