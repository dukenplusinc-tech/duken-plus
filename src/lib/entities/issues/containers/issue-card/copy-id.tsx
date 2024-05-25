import {FC, useEffect, useState} from "react";
import {useCopyToClipboard} from 'usehooks-ts'

import {
  Copy
} from "lucide-react"

import {Tooltip, TooltipContent} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button"

export const CopyIssueId: FC<{ id: string }> = ({id}) => {
  const [isOpen, setOpen] = useState(false)

  const [, copy] = useCopyToClipboard()

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;

    if (isOpen) {
      timeout = setTimeout(() => {
        setOpen(false)
      }, 3000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [isOpen])

  const handleCopyId = async () => {
    await copy(id)

    setOpen(true)
  }

  return (
    <Tooltip open={isOpen}>
      <Button
        size="icon"
        variant="outline"
        className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={handleCopyId}
      >
        <Copy className="h-3 w-3"/>
        <span className="sr-only">Copy Issue ID</span>
      </Button>

      <TooltipContent>
        Copied
      </TooltipContent>
    </Tooltip>
  );
}
