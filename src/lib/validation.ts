/**
 * Security validation utilities for the application.
 * Centralizing these checks ensures consistent enforcement of security policies.
 */

/**
 * Validates a username to prevent environment variable injection and other risks.
 * Usernames must only contain alphanumeric characters and underscores.
 * This is critical because usernames are used to look up environment variables
 * (e.g., USER_${username.toUpperCase()}_PASSWORD).
 */
export function isValidUsername(username: string): boolean {
  // Only allow alphanumeric characters and underscores
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  return usernameRegex.test(username);
}

/**
 * Validates the length of the JWT secret.
 * Security best practices recommend at least 32 characters for HMAC-SHA256 secrets.
 */
export function validateJwtSecret(secret: string | undefined): boolean {
  if (!secret) return false;
  return secret.length >= 32;
}
