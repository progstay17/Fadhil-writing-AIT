## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2025-05-16 - Inconsistent Secret Validation
**Vulnerability:** Weak `JWT_SECRET` could be used during login if only the verification logic enforced length, leading to "valid but unverifyable" tokens or deployment with weak keys.
**Learning:** Security constraints must be enforced at every stage of a credential's lifecycle (creation and verification) to ensure consistency and prevent silent failures.
**Prevention:** Centralize security configuration checks or ensure all endpoints handling sensitive secrets apply identical validation logic.
