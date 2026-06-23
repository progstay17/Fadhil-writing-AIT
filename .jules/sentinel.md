## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2025-05-16 - Dynamic Property Injection in Env Lookups
**Vulnerability:** Use of unvalidated user-provided strings (usernames) as keys for dynamic `process.env` lookups.
**Learning:** Even with alphanumeric regexes, user-provided keys can target dangerous properties like `__proto__` or `constructor` if the object is not a null-prototype object.
**Prevention:** Strictly validate any string used for dynamic property access against a regex, length limit, and a case-insensitive blacklist of prohibited property names.
