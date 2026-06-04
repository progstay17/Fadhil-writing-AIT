## 2025-05-15 - Hardcoded JWT Secret Fallback
**Vulnerability:** Use of a hardcoded default string as a fallback for JWT secret in `src/lib/auth.ts`.
**Learning:** Default fallbacks in security code can lead to insecure deployments if environment variables are missing.
**Prevention:** Always fail securely by throwing an error or returning null when critical security configurations are missing, instead of providing a "default" that might be known or predictable.

## 2025-05-22 - API Error Information Leakage
**Vulnerability:** Raw error messages from the Google Generative AI SDK were being returned to the client in `src/app/api/generate/route.ts`.
**Learning:** Returning raw error messages can leak internal implementation details, API structures, or even stack traces if not carefully handled.
**Prevention:** Use a safe-list approach for error messages. Only return specific, pre-defined safe messages to the client and log the full error details server-side.
