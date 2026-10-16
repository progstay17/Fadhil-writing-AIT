## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2025-05-15 - Bundled Security Refactors and Implicit Breakage
**Vulnerability:** Excessive bundling of security fixes (CSP, JWT hardening, Error handling) in a single PR.
**Learning:** Adding a restrictive Content Security Policy (CSP) without full knowledge of application dependencies can cause silent regressions. Enforcing stricter security constraints (like JWT secret length) in existing environments can be a breaking change.
**Prevention:** Implement security changes atomically. Prioritize "Ask First" for changes that affect environment requirements or global connectivity.
