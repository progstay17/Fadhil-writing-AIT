## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2025-05-16 - Dynamic Environment Variable Lookup Risk
**Vulnerability:** Use of unsanitized user input (username) to dynamically construct environment variable keys for password retrieval (e.g., `process.env["USER_" + username + "_PASSWORD"]`).
**Learning:** Dynamic property access on objects like `process.env` using user-provided strings can lead to unexpected behavior or injection if the input is not strictly validated. While `process.env` usually only contains strings, allowing arbitrary keys could potentially bypass logic or hit internal properties if not properly scoped.
**Prevention:** Strictly validate any user input used for dynamic key construction using a whitelist or a restrictive regex (e.g., `/^[a-zA-Z0-9_]+$/`).
