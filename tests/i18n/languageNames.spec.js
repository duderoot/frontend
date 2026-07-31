import fs from 'fs';
import path from 'path';

// The language picker builds its keys dynamically (`language.${locale}`), so
// `vue-i18n-extract` reports them as "suspected dynamic" and cannot verify
// them. That is how a shipped locale ended up with no name of its own. These
// tests close that gap.
const LOCALES_DIR = path.resolve(__dirname, '../../src/i18n/locales');

const localeFileNames = fs
  .readdirSync(LOCALES_DIR)
  .filter((name) => name.endsWith('.json'))
  .sort();

const shippedLocales = localeFileNames.map((name) =>
  name.replace(/\.json$/, ''),
);

function readLocale(fileName) {
  return JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, fileName), 'utf8'));
}

describe('locale files', () => {
  it('ships more than one locale', () => {
    expect(shippedLocales.length).toBeGreaterThan(1);
    expect(shippedLocales).toContain('en');
  });

  it('gives every shipped locale a display name in English', () => {
    const languageNames = readLocale('en.json').language;

    for (const locale of shippedLocales) {
      expect(Object.keys(languageNames)).toContain(locale);
      expect(typeof languageNames[locale]).toBe('string');
      expect(languageNames[locale].trim()).not.toHaveLength(0);
    }
  });

  it('declares every language key in every locale file', () => {
    const englishKeys = Object.keys(readLocale('en.json').language).sort();

    for (const fileName of localeFileNames) {
      const languageNames = readLocale(fileName).language;
      // Translations may legitimately be null (untranslated), but the key has
      // to exist so the fallback resolves instead of rendering the raw path.
      expect({
        file: fileName,
        keys: Object.keys(languageNames).sort(),
      }).toEqual({ file: fileName, keys: englishKeys });
    }
  });

  it('does not name a language that is not shipped', () => {
    const languageNames = Object.keys(readLocale('en.json').language).sort();

    expect(languageNames).toEqual(shippedLocales.slice().sort());
  });
});
