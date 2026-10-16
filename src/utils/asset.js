/** Resolve a path inside /public so it works under any deploy sub-path. */
export const asset = (p) => (p && !/^(https?:|data:|\/)/.test(p) ? import.meta.env.BASE_URL + p : p);
