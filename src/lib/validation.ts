/**
 * Validates a username against a strict alphanumeric and underscore regex.
 * Prevents potential environment variable injection or property access risks.
 */
export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_]+$/.test(username);
}

/**
 * Validates that the JWT secret is defined and meets the minimum length requirement.
 */
export function isValidJwtSecret(secret: string | undefined): secret is string {
  return typeof secret === "string" && secret.length >= 32;
}
