## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2025-05-16 - Dynamic Property Injection in Environment Lookups
**Vulnerability:** User-provided usernames were used directly as keys to access `process.env` (e.g., `process.env["USER_" + username + "_PASSWORD"]`) without format validation.
**Learning:** Dynamic property access using unvalidated strings can allow attackers to access unintended environment variables or trigger unexpected object behavior.
**Prevention:** Strictly validate all input used for property lookup or environment access using a restrictive regex like `/^[a-zA-Z0-9_]+$/`.
