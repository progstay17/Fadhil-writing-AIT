export const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

/**
 * Validates that a username contains only alphanumeric characters and underscores.
 * This is crucial for preventing injection risks when usernames are used as keys in environment lookups.
 */
export function isValidUsername(username: string | undefined): boolean {
  if (!username) return false;
  return USERNAME_REGEX.test(username);
}

/**
 * Validates that a JWT secret is defined and meets the minimum length requirement.
 */
export function isValidJwtSecret(secret: string | undefined): boolean {
  return !!secret && secret.length >= 32;
}
