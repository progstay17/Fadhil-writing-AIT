## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2025-05-16 - Dynamic Property Injection via Username
**Vulnerability:** User-provided usernames were used directly to construct keys for `process.env` lookups without validation.
**Learning:** Even if keys are prefixed (e.g., `USER_`), malicious input like `__proto__` could theoretically lead to property injection or unexpected behavior if the environment object is not handled carefully.
**Prevention:** Strictly validate user-provided strings against an alphanumeric regex and a blacklist of dangerous property names before using them as keys in any object lookup.
