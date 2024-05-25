import type {HTMLAttributes} from "react";
import Link from "next/link"

import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Analytics
      </Link>
      <Link
        href="/issues"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Issues
      </Link>
    </nav>
  )
}
