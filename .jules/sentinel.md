## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2025-05-16 - Property Injection via Unsanitized Usernames
**Vulnerability:** Usernames were used to dynamically access `process.env` properties without strict validation.
**Learning:** Even alphanumeric regexes can allow dangerous property names like `__proto__` or `constructor` which can lead to prototype pollution or bypasses if keys are used in sensitive object lookups.
**Prevention:** Implement a strict blacklist for dangerous property names alongside alphanumeric validation and length limits for all user-derived keys used in dynamic lookups.
