## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2026-06-14 - Username Environment Variable Injection
**Vulnerability:** Dynamic property access on `process.env` using unsanitized user input (username).
**Learning:** Using untrusted input to construct keys for object or environment variable lookups can lead to unauthorized access to sensitive configuration.
**Prevention:** Strictly validate any input used in dynamic lookups against a whitelist or a tight regex (e.g., `/^[a-zA-Z0-9_]+$/`) to prevent access to unintended properties.
