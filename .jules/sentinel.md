## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2025-05-16 - Property Injection via Unsanitized Usernames
**Vulnerability:** Usernames were used directly as keys in `process.env` without validation, allowing potential property injection (e.g., `__proto__`, `constructor`).
**Learning:** Even when prefixed, unsanitized user input used as object keys can lead to unexpected behavior or security bypasses if they match built-in property names.
**Prevention:** Always validate user-provided keys against a strict alphanumeric regex and a blacklist of reserved property names before using them in dynamic object lookups.
