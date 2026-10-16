## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2025-05-16 - Dynamic Environment Variable Injection
**Vulnerability:** Use of user-provided strings (usernames) as dynamic keys for `process.env` lookups without strict validation.
**Learning:** Even if the resulting environment variable name is prefixed, malicious input like `__proto__` or long strings could lead to prototype pollution or unexpected behavior if the lookup logic isn't restrictive.
**Prevention:** Always validate user-provided strings against a strict whitelist (e.g., alphanumeric regex) and a blacklist of reserved property names before using them as keys for dynamic object access.
