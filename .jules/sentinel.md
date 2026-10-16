## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2025-05-22 - Logic Duplication in Security Validation
**Vulnerability:** Scattered security regex and validation logic across multiple files (login route, token verification, and tests).
**Learning:** Hardcoding security rules in multiple places leads to maintenance overhead and "security theater" where tests verify their own local logic instead of the application's actual implementation.
**Prevention:** Centralize all security validation logic in a shared utility file and import it everywhere, including tests, to ensure a single source of truth and meaningful test coverage.
