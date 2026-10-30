import { mainRoutes } from './mainRoutes';
import { errorRoutes } from './errorRoutes';

export const appRoutes = [...mainRoutes, ...errorRoutes];
