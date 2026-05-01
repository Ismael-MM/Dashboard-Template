import type { FiltersParams } from './api';
import type { UserRecord } from './users';

export interface RoleOption {
  id: string;
  name: string;
}

export interface PermissionOption {
  id: string;
  name: string;
}

export interface RolesParams extends FiltersParams {
  name?: string;
}

export interface RoleRecord {
  id: string;
  name: string;
  permissions?: PermissionOption[] | null;
  users?: UserRecord | null;
}

export interface RolePayload {
  name: string;
  permissions?: string[];
}