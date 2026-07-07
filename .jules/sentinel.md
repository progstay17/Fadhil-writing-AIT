## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2025-05-16 - Property Injection via Unsanitized Usernames
**Vulnerability:** Usernames were used to construct dynamic keys for `process.env` lookups without character or length validation, potentially allowing property injection or unexpected behavior if a user could control the username.
**Learning:** Even if a dynamic key is prefixed (e.g., `USER_${username}_KEY`), unsanitized input can still target sensitive object properties like `__proto__` or `constructor` if not explicitly blocked.
**Prevention:** Always validate and sanitize all components of a dynamic key against a strict allowlist (regex) and a blacklist of dangerous property names before using them for object lookups.
