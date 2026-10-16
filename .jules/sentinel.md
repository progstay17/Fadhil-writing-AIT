## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2025-05-16 - Dynamic Environment Variable Key Injection
**Vulnerability:** Use of user-provided strings (usernames) as keys for dynamic lookup in `process.env` without strict validation.
**Learning:** Even if the username is intended to be simple, failing to enforce a strict character set (e.g., alphanumeric only) can allow attackers to access unexpected environment variables or potentially trigger property injection.
**Prevention:** Always validate user input against a strict allowlist (e.g., `/^[a-zA-Z0-9_]+$/`) and a blacklist of dangerous property names (e.g., `__proto__`) before using it in dynamic object lookups.
