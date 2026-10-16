## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2025-05-20 - Unsanitized Username in Env Lookup
**Vulnerability:** Use of unsanitized username string to construct environment variable keys (e.g., `process.env[USER_${username.toUpperCase()}_PASSWORD]`).
**Learning:** Dynamic property access on `process.env` using external input without validation can lead to unintended environment variable disclosure or injection.
**Prevention:** Strictly validate any input used to construct keys for dynamic lookups against a safe whitelist (e.g., alphanumeric only).
