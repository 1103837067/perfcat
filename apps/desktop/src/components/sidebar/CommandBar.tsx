import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Plus } from "lucide-react"
import { useRef } from "react"

interface Props {
  disabled: boolean
  running: boolean
  onStart: () => void
  onStop: () => void
  metricSelector?: React.ReactNode
}

export function CommandBar({ disabled, running, onStart, onStop, metricSelector }: Props) {
  const groupRef = useRef<HTMLDivElement>(null)

  return (
    <div className="w-full">
      <div
        ref={groupRef}
        className="inline-flex w-full items-stretch overflow-hidden rounded-md border bg-card"
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="default"
              disabled={running}
              className="rounded-none border-r px-3"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="p-3"
            align="start"
            style={{ width: groupRef.current?.offsetWidth || "16rem" }}
          >
            {metricSelector ?? <div className="text-sm text-muted-foreground">请选择性能参数</div>}
          </PopoverContent>
        </Popover>

        <Button
          className="flex-1 rounded-none"
          onClick={running ? onStop : onStart}
          disabled={disabled}
        >
          {running ? "停止" : "开始监控"}
        </Button>
      </div>
    </div>
  )
}

