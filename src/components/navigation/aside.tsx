import type {FC} from "react";
import Link from "next/link"

import {
  DatabaseZap
} from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {useAsideMenu, MenuItem} from "@/lib/navigation/hooks/menu";

const MenuList: FC<{ menu: MenuItem[] }> = ({menu: menuList}) => (
  <>
    {menuList.map((menu, idx) => (
      <Tooltip key={idx.toString()}>
        <TooltipTrigger asChild>
          <Link
            href={menu.href}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
          >
            {menu.icon}
            <span className="sr-only">{menu.title}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{menu.title}</TooltipContent>
      </Tooltip>
    ))}
  </>
)

export const AsideNav: FC = () => {
  const {sideMenu, sideMenuBottom} = useAsideMenu()

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
        <Link
          href="#"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <DatabaseZap className="h-4 w-4 transition-all group-hover:scale-110"/>
          <span className="sr-only">Crashlitics</span>
        </Link>

        <MenuList menu={sideMenu}/>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
        <MenuList menu={sideMenuBottom}/>
      </nav>
    </aside>
  )
}