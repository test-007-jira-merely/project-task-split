export interface StringNormalizer {
  normalize(str: string): string;
  deduplicate(strings: string[]): string[];
  fuzzyMatch(str1: string, str2: string): boolean;
}

class StringNormalizerImpl implements StringNormalizer {
  normalize(str: string): string {
    return str.trim().toLowerCase();
  }

  deduplicate(strings: string[]): string[] {
    const normalized = strings.map(s => this.normalize(s));
    const unique = Array.from(new Set(normalized));
    return unique;
  }

  fuzzyMatch(str1: string, str2: string): boolean {
    const normalized1 = this.normalize(str1);
    const normalized2 = this.normalize(str2);
    return normalized1.includes(normalized2) || normalized2.includes(normalized1);
  }
}

export const stringNormalizer = new StringNormalizerImpl();
