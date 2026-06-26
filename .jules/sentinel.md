## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2025-05-16 - Dynamic Property Injection via Username
**Vulnerability:** Use of unsanitized username strings in dynamic `process.env` lookups (e.g., `process.env[`USER_${username.toUpperCase()}_PASSWORD`]`).
**Learning:** Even with a prefix, user-controlled strings used as object keys can lead to unexpected property access or injection if not strictly validated against a safe character set and length.
**Prevention:** Implement strict alphanumeric regex validation and a property-name blacklist for any user-provided data used in dynamic key lookups.
