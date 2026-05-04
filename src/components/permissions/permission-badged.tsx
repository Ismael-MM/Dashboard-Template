'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ChevronDown } from 'lucide-react'
import type { PermissionOption } from '@/types/permissions'

interface PermissionBadgesProps {
  permissions: PermissionOption[]
  maxVisible?: number
}

export function PermissionBadges({ permissions, maxVisible = 3 }: PermissionBadgesProps) {
  const [open, setOpen] = useState(false)

  const visiblePermissions = permissions.slice(0, maxVisible)
  const hiddenPermissions = permissions.slice(maxVisible)
  const hasMore = hiddenPermissions.length > 0

  if (permissions.length === 0) {
    return (
      <span className="text-muted-foreground text-sm italic">
        Sin permisos
      </span>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-1">
      {visiblePermissions.map((permission) => (
        <Badge key={permission.id} variant="secondary" className="text-xs">
          {permission.label}
        </Badge>
      ))}
      
      {hasMore && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              +{hiddenPermissions.length} más
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2" align="start">
            <div className="flex flex-wrap gap-1">
              {hiddenPermissions.map((permission) => (
                <Badge key={permission.id} variant="secondary" className="text-xs">
                  {permission.label}
                </Badge>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
