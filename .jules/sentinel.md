## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2025-05-16 - Dynamic Property Access via User Input
**Vulnerability:** Constructing keys for `process.env` lookups using unvalidated user-provided usernames.
**Learning:** Dynamic property access using user-controlled strings can lead to unexpected behavior or property injection if not strictly validated against a whitelist.
**Prevention:** Always validate user input against a strict regex (e.g., `/^[a-zA-Z0-9_]+$/`) before using it to access objects or environment variables.
