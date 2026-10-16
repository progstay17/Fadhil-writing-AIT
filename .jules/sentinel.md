## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2025-05-16 - Dynamic process.env Property Access
**Vulnerability:** User-provided strings (usernames) were used for dynamic property access on `process.env` without validation.
**Learning:** This pattern can allow attackers to probe for internal object properties or unexpected environment variables.
**Prevention:** Strictly validate any user-provided string against an allow-list or a safe regex (e.g., `/^[a-zA-Z0-9_]+$/`) before using it as a key for dynamic property access.
