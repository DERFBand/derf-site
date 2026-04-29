export function buildPageTitle(pageLabel, siteName) {
  if (!pageLabel) return siteName || ''
  if (!siteName) return pageLabel
  return `${pageLabel} — ${siteName}`
}
