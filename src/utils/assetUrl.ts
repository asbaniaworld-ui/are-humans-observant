/** Resolve public asset paths (GitHub Pages subpath + local dev). */
function getAppBase(): string {
  const envBase = import.meta.env.BASE_URL;
  if (envBase && envBase !== '/') {
    return envBase.endsWith('/') ? envBase : `${envBase}/`;
  }

  if (typeof window !== 'undefined') {
    const segment = window.location.pathname.split('/').filter(Boolean)[0];
    if (segment && !segment.includes('.')) {
      return `/${segment}/`;
    }
  }

  return '/';
}

export function assetUrl(path: string): string {
  const normalized = path.replace(/^\//, '');
  return `${getAppBase()}${normalized}`;
}
