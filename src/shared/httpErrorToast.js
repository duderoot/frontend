/**
 * Axios request-config flag that opts a single request out of the global
 * error toast installed in App.vue.
 *
 * Set it on requests whose failure is either expected (an optional resource
 * that may legitimately be absent) or already reported by the call site, so
 * the user is not shown a generic "HTTP Request Error" for something the
 * application has already handled.
 *
 * Usage: `axios.get(url, SUPPRESS_GLOBAL_ERROR_TOAST)`
 */
export const SUPPRESS_GLOBAL_ERROR_TOAST_KEY = 'suppressGlobalErrorToast';

export const SUPPRESS_GLOBAL_ERROR_TOAST = Object.freeze({
  [SUPPRESS_GLOBAL_ERROR_TOAST_KEY]: true,
});

/**
 * @param {object} error an axios error
 * @returns {boolean} whether the failing request opted out of the global toast
 */
export function suppressesGlobalErrorToast(error) {
  return Boolean(
    error && error.config && error.config[SUPPRESS_GLOBAL_ERROR_TOAST_KEY],
  );
}
