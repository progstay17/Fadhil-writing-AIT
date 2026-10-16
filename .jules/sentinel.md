## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2025-05-16 - Dynamic process.env Access
**Vulnerability:** Dynamic property access on `process.env` using unvalidated user-provided strings (usernames) in login and generation routes.
**Learning:** Using user input directly as keys for `process.env` lookup is a security risk as it could allow access to unintended environment variables or internal object properties.
**Prevention:** Strictly validate all user-provided strings against a safe whitelist (e.g., `/^[a-zA-Z0-9_]+$/`) before using them as keys for dynamic property access on system objects.
