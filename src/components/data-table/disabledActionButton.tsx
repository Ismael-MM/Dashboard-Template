import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip'
import { Button } from '../ui/button'
import type { ReactNode } from 'react'

interface Props {
  icon: ReactNode
  text: string
}

export function DisabledActionButton({
  icon,
  text,
}: Props) {

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-not-allowed">
          <Button size="icon-sm" variant="outline" disabled>
            {icon}
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  )
}