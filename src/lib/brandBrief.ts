import fs from 'fs';
import path from 'path';

const loadBrandBrief = (): string => {
  try {
    const filePath = path.join(process.cwd(), 'BRAND_BRIEF.md');
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    console.warn('Warning: BRAND_BRIEF.md not found or unreadable. Falling back to empty string.');
    return '';
  }
};

export const BRAND_BRIEF = loadBrandBrief();
