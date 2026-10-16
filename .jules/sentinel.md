## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2025-05-16 - API Error Message Information Leak
**Vulnerability:** API endpoint returning raw error messages from external SDKs (e.g., Google Generative AI).
**Learning:** Raw `error.message` can contain sensitive details like API keys, internal paths, or downstream service info. Even when security patterns are documented, implementation must be verified.
**Prevention:** Always use a whitelist of safe error messages or return a generic one for unhandled exceptions in production.
