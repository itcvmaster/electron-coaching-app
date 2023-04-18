/**
 * Try to get the base path from `import.meta.url`.
 */
export default function importBasePath(url) {
  const match = url.match(/(.*?\/js\/)/);
  if (match) return match[1];
  return url;
}
