## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2025-05-15 - User-Input Dependent Env Var Lookup
**Vulnerability:** Constructing environment variable keys using unsanitized user input (e.g., `process.env['USER_' + username + '_PASSWORD']`).
**Learning:** This pattern allows environment variable injection if the input is not strictly validated, potentially exposing other sensitive configurations.
**Prevention:** Always sanitize and validate user input against a strict whitelist (e.g., `/^[a-zA-Z0-9_]+$/`) before using it to access dynamic configuration keys.
