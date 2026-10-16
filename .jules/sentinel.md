## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2026-06-01 - Information Disclosure in API Errors
**Vulnerability:** Raw SDK error messages were being returned to the client in `src/app/api/generate/route.ts`.
**Learning:** Even if stack traces are disabled, raw error messages from third-party SDKs can leak internal implementation details, such as service names or parameter names.
**Prevention:** Always map caught errors to a set of safe, generic user-facing messages. Never pass `error.message` directly to the response unless it's been explicitly sanitized or is known to be safe.
