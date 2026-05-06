'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { PermissionOption, PermissionRecord } from '@/types/permissions'

interface PermissionSelectorProps {
  permissions: PermissionOption[]
  selectedPermissions: string[]
  onPermissionsChange: (permissions: string[]) => void
}

export function PermissionSelector({
  permissions = [],
  selectedPermissions = [],
  onPermissionsChange,
}: PermissionSelectorProps) {
  console.log(permissions)
  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.group]) {
      acc[permission.group] = []
    }
    acc[permission.group].push(permission)
    return acc
  }, {} as Record<string, typeof permissions[number][]>)

  const handlePermissionToggle = (permissionId: string, checked: boolean) => {
    if (checked) {
      onPermissionsChange([...selectedPermissions, permissionId])
    } else {
      onPermissionsChange(selectedPermissions.filter(p => p !== permissionId))
    }
  }

  const handleGroupToggle = (group: string, checked: boolean) => {
    const groupPermissionIds = groupedPermissions[group].map(p => p.name)
    
    if (checked) {
      const newPermissions = [...new Set([...selectedPermissions, ...groupPermissionIds])]
      onPermissionsChange(newPermissions)
    } else {
      onPermissionsChange(selectedPermissions.filter(p => !groupPermissionIds.includes(p)))
    }
  }

  const isGroupChecked = (group: string) => {
    const groupPermissionIds = groupedPermissions[group].map(p => p.name)
    console.log("Group check:",groupPermissionIds)
    return groupPermissionIds.every(id => selectedPermissions.includes(id))
  }

  const isGroupIndeterminate = (group: string) => {
    const groupPermissionIds = groupedPermissions[group].map(p => p.name)
    const checkedCount = groupPermissionIds.filter(name => selectedPermissions.includes(name)).length
    return checkedCount > 0 && checkedCount < groupPermissionIds.length
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Permisos</Label>
      <ScrollArea className="h-64 rounded-md border p-4">
        <div className="space-y-6">
          {Object.entries(groupedPermissions).map(([group, permissions]) => (
            <div key={group} className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`group-${group}`}
                  checked={isGroupChecked(group)}
                  data-indeterminate={isGroupIndeterminate(group)}
                  onCheckedChange={(checked) => handleGroupToggle(group, checked as boolean)}
                  className="data-[indeterminate=true]:bg-primary/50"
                />
                <Label
                  htmlFor={`group-${group}`}
                  className="text-sm font-semibold text-foreground cursor-pointer"
                >
                  {group}
                </Label>
              </div>
              
              <div className="ml-6 space-y-2">
                {permissions.map((permission) => (
                  <div key={permission.name} className="flex items-center gap-2">
                    <Checkbox
                      id={permission.name}
                      checked={selectedPermissions.includes(permission.name)}
                      onCheckedChange={(checked) => 
                        handlePermissionToggle(permission.name, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={permission.name}
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      {permission.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <p className="text-xs text-muted-foreground">
        {selectedPermissions.length} permiso(s) seleccionado(s)
      </p>
    </div>
  )
}
