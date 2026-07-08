## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2025-05-16 - Property Injection via Unsanitized Usernames
**Vulnerability:** Unsanitized usernames were used as keys in dynamic `process.env` lookups (e.g., `process.env["USER_" + username + "_KEY"]`).
**Learning:** Even with prefixes, using user-controlled input as object keys can allow access to sensitive prototype properties like `__proto__` or `constructor` if not strictly validated.
**Prevention:** Implement strict alphanumeric/length validation and a case-insensitive blacklist for dangerous property names before using user input as dynamic object keys.
