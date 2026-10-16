## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2025-05-16 - Dynamic Property Injection in Environment Lookups
**Vulnerability:** Use of unsanitized user-provided strings (usernames) as keys for dynamic  lookups.
**Learning:** Even with prefixes/suffixes, dynamic property access can be abused if the input isn't strictly validated, potentially leading to unauthorized access to other environment variables or prototype pollution.
**Prevention:** Strictly validate all inputs used for dynamic key lookups against a strict alphanumeric allow-list and a case-insensitive blacklist of dangerous property names like '__proto__' and 'constructor'.
