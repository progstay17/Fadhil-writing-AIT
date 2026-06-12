export function isValidUsername(username: string | undefined): boolean {
  return typeof username === 'string' && /^[a-zA-Z0-9_]+$/.test(username);
}

export function isValidJwtSecret(secret: string | undefined): boolean {
  return typeof secret === 'string' && secret.length >= 32;
}
