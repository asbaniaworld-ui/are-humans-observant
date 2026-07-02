/** Resolve public asset paths for GitHub Pages subpath deploys. */
export function assetUrl(path: string): string {
  const normalized = path.replace(/^\//, '');
  let base = import.meta.env.BASE_URL ?? '/';
  if (!base.endsWith('/')) base += '/';

  // Runtime fallback when build base was not set for project-site deploy.
  if (
    typeof window !== 'undefined' &&
    base === '/' &&
    window.location.hostname.endsWith('github.io') &&
    window.location.pathname.startsWith('/are-humans-observant')
  ) {
    base = '/are-humans-observant/';
  }

  return `${base}${normalized}`;
}
