import api from "@/api/axios";

export interface RoleOption {
  id: string;
  name: string;
}



export const getRolesDropdown = async (): Promise<RoleOption[]> => {
  const { data } = await api.get<RoleOption[]>("/roles/list");
  return data;
};