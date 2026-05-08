import type { FiltersParams } from './api';
import type { RoleRecord } from './roles';

export interface PermissionOption {
  id: string;
  name: string;
  label: string;
  group: string;
}

export interface PermissionsParams extends FiltersParams {
  name?: string;
  label?: string;
  group?: string;
}

export interface PermissionRecord {
  id: string;
  name: string;
  label: string;
  group: string;
  roles?: RoleRecord | null;
}

export interface PermissionPayload {
  name: string;
  label: string;
  group: string;
}

export const PermissionsEnum = {
  USERS_READ: 'USERS_READ',
  USERS_CREATE: 'USERS_CREATE',
  USERS_DELETE: 'USERS_DELETE',
  USERS_UPDATE: 'USERS_UPDATE',

  ROLES_READ: 'ROLES_READ',
  ROLES_CREATE: 'ROLES_CREATE',
  ROLES_DELETE: 'ROLES_DELETE',
  ROLES_UPDATE: 'ROLES_UPDATE',

  PERMISSIONS_READ: 'PERMISSIONS_READ',
  PERMISSIONS_CREATE: 'PERMISSIONS_CREATE',
  PERMISSIONS_DELETE: 'PERMISSIONS_DELETE',
  PERMISSIONS_UPDATE: 'PERMISSIONS_UPDATE',
}
