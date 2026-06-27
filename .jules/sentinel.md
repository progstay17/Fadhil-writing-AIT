## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2025-05-16 - Dynamic Environment Variable Key Injection
**Vulnerability:** User-provided usernames were used directly to construct keys for `process.env` lookups (e.g., `process.env["USER_" + username + "_PASSWORD"]`) without validation.
**Learning:** This pattern allows attackers to potentially access unintended environment variables or trigger unexpected behavior by providing special usernames like `__proto__` or `constructor`. Alphanumeric validation alone is insufficient; a blacklist of dangerous property names is also required.
**Prevention:** Strictly validate any user input used as a dynamic key against a whitelist of characters and a blacklist of dangerous property names before use.
