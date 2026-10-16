## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2025-05-16 - Secure Username Validation for Dynamic Environment Lookups
**Vulnerability:** Potential property injection or unexpected environment access via unvalidated usernames used as keys in `process.env`.
**Learning:** Dynamic property access on objects like `process.env` using user-derived strings requires strict alphanumeric validation and a blacklist of sensitive property names (e.g., `__proto__`, `constructor`, `tostring`) to prevent security bypasses.
**Prevention:** Implement a centralized `isValidUsername` utility with regex and blacklist checks, and apply it consistently at entry points and before dynamic lookups.
