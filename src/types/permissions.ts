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