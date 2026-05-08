import { useCan } from '@/hooks/auth/UseCan';
import { PermissionsEnum } from '@/types/permissions';

interface Props {
  permission: keyof typeof PermissionsEnum; // Esto te da autocompletado
  children: React.ReactNode;
  fallback?: React.ReactNode; // Opcional: qué mostrar si no tiene permiso
}

export function HasPermission({ permission, children, fallback = null}: Props) {
  const { can } = useCan();

  if (!can(permission)) {
    return <>{fallback}</>
  }else{
    return <>{children}</>
  }
};
