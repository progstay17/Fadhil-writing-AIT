## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2025-05-20 - Environment Variable Key Injection
**Vulnerability:** Dynamic construction of environment variable keys using unsanitized user input in `src/app/api/auth/login/route.ts`.
**Learning:** Using user-provided strings to access `process.env` can lead to unintended access to sensitive configuration values if not strictly validated.
**Prevention:** Implement strict alphanumeric validation (regex) on any user input used as a key or part of a key for environment variable or object property access.
