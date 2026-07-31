// Offset from an ASCII lowercase letter to its REGIONAL INDICATOR SYMBOL
// counterpart, the pair of which renders as a flag emoji.
const REGIONAL_INDICATOR_OFFSET = 127365;

// Locales whose language subtag is not also the country code of the flag we
// want to show. Without an entry here the language subtag is used as-is, which
// for e.g. "ko" would build an unassigned pair that renders as bare letters.
const LANGUAGE_CODE_TO_COUNTRY_CODE = {
  EN: 'US', // Sorry Britain!
  HI: 'IN',
  JA: 'JP',
  KO: 'KR',
  ZH: 'CN',
};

/**
 * Renders the flag emoji for a locale code such as "de", "pt-BR" or "uk-UA".
 *
 * Largely taken from wojtekmaj/country-code-to-flag-emoji. Adopted to be able to deal with locale codes as inputs.
 * https://github.com/wojtekmaj/country-code-to-flag-emoji/blob/ff0d3d2dd9680b6f860d85fc9e713e93e396adb7/src/index.ts
 *
 * @param {string} locale locale code, optionally region-qualified
 * @returns {string} the flag emoji, or an empty string for an unusable input
 */
export function localeToFlagEmoji(locale) {
  if (typeof locale !== 'string' || locale.length === 0) {
    return '';
  }

  // A region subtag ("pt-BR") already names the country; otherwise the
  // language subtag stands in for it.
  const subtag = locale.split('-').pop().toUpperCase();
  const countryCode = LANGUAGE_CODE_TO_COUNTRY_CODE[subtag] || subtag;

  // Anything that is not two ASCII letters has no regional indicator pair.
  if (!/^[A-Z]{2}$/.test(countryCode)) {
    return '';
  }

  return Array.from(countryCode)
    .map(
      (letter) =>
        letter.toLowerCase().charCodeAt(0) + REGIONAL_INDICATOR_OFFSET,
    )
    .map((charCode) => String.fromCodePoint(charCode))
    .join('');
}
