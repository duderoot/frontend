import {
  SUPPRESS_GLOBAL_ERROR_TOAST,
  SUPPRESS_GLOBAL_ERROR_TOAST_KEY,
  suppressesGlobalErrorToast,
} from '@/shared/httpErrorToast';

describe('suppressesGlobalErrorToast', () => {
  it('recognises an error from a request that opted out', () => {
    const error = { config: { ...SUPPRESS_GLOBAL_ERROR_TOAST } };

    expect(suppressesGlobalErrorToast(error)).toBe(true);
  });

  it('does not suppress an ordinary request failure', () => {
    expect(suppressesGlobalErrorToast({ config: {} })).toBe(false);
    expect(suppressesGlobalErrorToast({ config: { url: '/api/v1/x' } })).toBe(
      false,
    );
  });

  it('tolerates errors that never reached a request', () => {
    expect(suppressesGlobalErrorToast(undefined)).toBe(false);
    expect(suppressesGlobalErrorToast(null)).toBe(false);
    expect(suppressesGlobalErrorToast({})).toBe(false);
    expect(suppressesGlobalErrorToast({ config: null })).toBe(false);
  });

  it('is usable directly as an axios request config', () => {
    // Axios merges unknown keys into the config it hands back on failure, so
    // the exported object must carry the flag under the documented key.
    expect(SUPPRESS_GLOBAL_ERROR_TOAST[SUPPRESS_GLOBAL_ERROR_TOAST_KEY]).toBe(
      true,
    );
  });

  it('cannot be mutated by a call site', () => {
    expect(() => {
      SUPPRESS_GLOBAL_ERROR_TOAST[SUPPRESS_GLOBAL_ERROR_TOAST_KEY] = false;
    }).toThrow();

    expect(
      suppressesGlobalErrorToast({ config: SUPPRESS_GLOBAL_ERROR_TOAST }),
    ).toBe(true);
  });
});
