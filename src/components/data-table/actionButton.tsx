import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip'
import { Button } from '../ui/button'
import { ConfirmDeleteDialog } from '../ui/confirm_delete_dialog'
import type { ReactNode } from 'react'

interface Props<TRecord> {
  icon: ReactNode
  color?: string
  description: string
  tooltiptext: string
  tooltipkey: string
  delete?: boolean
  item: TRecord
  action: (item: TRecord) => Promise<void> | void
}

export function ActionButton<TRecord>({
  icon,
  color,
  tooltiptext,
  tooltipkey,
  description,
  item,
  delete: isDelete,
  action,
}: Props<TRecord>) {

  return (
    <Tooltip key={tooltipkey}>
      <TooltipTrigger asChild>
        <div>
          {isDelete ?
            <ConfirmDeleteDialog
              title="Delete user"
              description={description}
              onConfirm={() => action(item)}
              trigger={(
                <Button
                  size="icon-sm"
                  variant="outline"
                  className="border-red-400 bg-red-500/10 text-red-700 hover:bg-red-500/20 hover:text-red-600"
                >
                  {icon}
                </Button>

              )}
            />
            :
            <Button
              size="icon-sm"
              variant="outline"
              className={color}
              onClick={() => action(item)}
            >
              {icon}
              <span className="sr-only">{description}</span>
            </Button>
          }
        </div>
      </TooltipTrigger>
      <TooltipContent side='top'>
        <p className='text-sm'>{tooltiptext}</p>
      </TooltipContent>
    </Tooltip>
  )
}