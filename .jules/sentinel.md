## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.
## 2025-05-16 - Case-Insensitive Property Injection Protection
**Vulnerability:** Usernames were used as keys in `process.env` lookups (`process.env[`USER_${username.toUpperCase()}_PASSWORD`]`) without validation. This could allow access to internal properties like `__proto__` if the input is not strictly validated.
**Learning:** Even with `.toUpperCase()`, certain property names like `__proto__` or `toString` can still be problematic if they collide with built-in Object properties during dynamic lookup.
**Prevention:** Implement a strict alphanumeric regex and a case-insensitive blacklist for dangerous property names (`__proto__`, `constructor`, etc.) before using any user input as a dynamic object key.
