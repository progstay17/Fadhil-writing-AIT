## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2025-05-16 - Dynamic Env Lookup Injection
**Vulnerability:** Use of user-provided usernames to dynamically access `process.env` properties without strict validation.
**Learning:** Dynamic property access on critical objects like `process.env` using external input can lead to injection or unexpected access to environment variables if the input is not strictly constrained.
**Prevention:** Implement strict regex validation (e.g., `/^[a-zA-Z0-9_]+$/`) and use type guards to ensure input format matches expected safe keys before property access.
