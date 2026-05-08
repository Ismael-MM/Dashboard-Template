import { useAuth } from './UseAuth';
import { PermissionsEnum } from '@/types/permissions';

export function useCan() {
  const { user } = useAuth();

  const can  = (permissionName: keyof typeof PermissionsEnum) => {
    const permissions = user?.role?.permissions;

    if (!permissions || !Array.isArray(permissions)) {
      return false;
    }else{
      return permissions.some(
        (p) => p.name === PermissionsEnum[permissionName]
      )
    }
  }

  return { can };
}