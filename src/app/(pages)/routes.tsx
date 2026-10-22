export const ROUTES = {
  AUTH: '/auth',
  HOME: '/home',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

export const DEFAULT_ROUTE: AppRoute = ROUTES.AUTH;

const VALID_ROUTES: readonly string[] = Object.values(ROUTES);

const normalizePath = (path?: string | null): string => {
  const trimmed = (path ?? '').trim().split(/[?#]/)[0];
  if (trimmed === '' || trimmed === '/') return '';
  return `/${trimmed.replace(/^\/+|\/+$/g, '')}`.toLowerCase();
};

export const isValidRoute = (path?: string | null): path is AppRoute =>
  VALID_ROUTES.includes(normalizePath(path));

/** Empty or "/" -> DEFAULT_ROUTE. Unknown path -> null (caller shows not-found). */
export const resolveRoute = (path?: string | null): AppRoute | null => {
  const normalized = normalizePath(path);
  if (normalized === '') return DEFAULT_ROUTE;
  return isValidRoute(normalized) ? (normalized as AppRoute) : null;
};

export default ROUTES;
