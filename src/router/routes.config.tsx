import RolesPage from '@/pages/roles/roles';
import UsersPage from '@/pages/users/users';
import { ChartPieIcon, ChartSplineIcon, KeyIcon, SettingsIcon, ShieldIcon, UsersIcon, type LucideIcon } from 'lucide-react';


export interface AppRoute {
  path: string;
  label: string;
  icon: LucideIcon
  element?: React.ReactNode;
  showInSidebar?: boolean;
  children?: AppRoute[];
};

export const appRoutes: AppRoute[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: ChartSplineIcon,
    element: <div> Metricas o algo no se ya vere o no quien sabe</div>,
    showInSidebar: true
  },
  {
    path: '/config',
    label: 'Configuración',
    icon: SettingsIcon,
    showInSidebar: true,
    children: [
      {
        path: '/users',
        label: 'Usuarios',
        icon: UsersIcon,
        element: <UsersPage />,
        showInSidebar: true,
      },
      {
        path: '/roles',
        label: 'Roles',
        icon: ShieldIcon,
        element: <RolesPage />,
        showInSidebar: true,
      },
      {
        path: '/permissions',
        label: 'Permisos',
        icon: KeyIcon,
        element: <div>Permisos</div>,
        showInSidebar: true,
      },
    ],
  },
  {
    path: '/metrics',
    label: 'Engagement Metrics',
    icon: ChartPieIcon,
    element: <div>Metrics</div>,
    showInSidebar: true,
  },
];