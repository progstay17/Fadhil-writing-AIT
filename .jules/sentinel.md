## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2025-05-16 - Property Injection in Dynamic Environment Lookups
**Vulnerability:** Dynamic property access on `process.env` using user-provided strings (like usernames) can lead to property injection or access to unintended environment variables.
**Learning:** When using user-provided input as keys for object lookups, even if prefixed or transformed (like `.toUpperCase()`), it's critical to validate against a strict allowlist and a blacklist of dangerous property names like `__proto__` or `constructor`.
**Prevention:** Implement a centralized validation utility (`isValidUsername`) that enforces a strict alphanumeric format and checks against a case-insensitive blacklist of forbidden property names before any dynamic lookup.
