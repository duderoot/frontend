import { localeToFlagEmoji } from '@/shared/localeFlag';

describe('localeToFlagEmoji', () => {
  it('derives the flag from the region subtag when the locale has one', () => {
    expect(localeToFlagEmoji('pt-BR')).toBe('🇧🇷');
    expect(localeToFlagEmoji('zh-TW')).toBe('🇹🇼');
    expect(localeToFlagEmoji('uk-UA')).toBe('🇺🇦');
  });

  it('uses the language subtag as the country code when they agree', () => {
    expect(localeToFlagEmoji('de')).toBe('🇩🇪');
    expect(localeToFlagEmoji('fr')).toBe('🇫🇷');
    expect(localeToFlagEmoji('it')).toBe('🇮🇹');
  });

  it('maps language subtags that are not their own country code', () => {
    expect(localeToFlagEmoji('en')).toBe('🇺🇸');
    expect(localeToFlagEmoji('hi')).toBe('🇮🇳');
    expect(localeToFlagEmoji('ja')).toBe('🇯🇵');
    expect(localeToFlagEmoji('zh')).toBe('🇨🇳');
  });

  // Regression: "ko" was missing from the mapping, so it built the unassigned
  // pair K+O, which renders as bare letters rather than a flag.
  it('maps Korean to the South Korean flag', () => {
    expect(localeToFlagEmoji('ko')).toBe('🇰🇷');
  });

  it('produces a flag for every locale the application ships', () => {
    const shippedLocales = [
      'de',
      'en',
      'es',
      'fr',
      'hi',
      'it',
      'ja',
      'ko',
      'pl',
      'pt',
      'pt-BR',
      'ru',
      'uk-UA',
      'zh',
      'zh-TW',
    ];

    for (const locale of shippedLocales) {
      const flag = localeToFlagEmoji(locale);
      // Every code point must be a regional indicator (U+1F1E6..U+1F1FF);
      // anything else means we emitted letters instead of a flag.
      const codePoints = Array.from(flag).map((char) => char.codePointAt(0));
      expect(codePoints).toHaveLength(2);
      for (const codePoint of codePoints) {
        expect(codePoint).toBeGreaterThanOrEqual(0x1f1e6);
        expect(codePoint).toBeLessThanOrEqual(0x1f1ff);
      }
    }
  });

  it('returns an empty string rather than mojibake for unusable input', () => {
    expect(localeToFlagEmoji('')).toBe('');
    expect(localeToFlagEmoji(null)).toBe('');
    expect(localeToFlagEmoji(undefined)).toBe('');
    expect(localeToFlagEmoji('x')).toBe('');
    expect(localeToFlagEmoji('klingon')).toBe('');
  });
});
