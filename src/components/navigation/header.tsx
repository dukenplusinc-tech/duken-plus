'use client';

import type {FC} from "react";
import Link from "next/link"
import {
  DatabaseZap,
  PanelLeft,
} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet"

import {useHeaderMenu} from "@/lib/navigation/hooks/menu";
import {useBreadcrumbsLinks} from "@/lib/navigation/breadcrumbs/context";

import {PageBreadcrumbs} from "@/components/page/breadcrumbs";
import {SearchComboBox} from "@/components/search-combo-box";
import {UserDropDownNav} from "@/lib/entities/user/containers/user-drop-down-nav";


export const HeaderNav: FC = () => {
  const menuItems = useHeaderMenu()
  const breadcrumbLinks = useBreadcrumbsLinks()

  return (
    <header
      className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5"/>
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <DatabaseZap className="h-5 w-5 transition-all group-hover:scale-110"/>
              <span className="sr-only">Crashlitics</span>
            </Link>

            {menuItems.map((menu, idx) => (
              <Link
                key={idx.toString()}
                href={menu.href}
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                {menu.icon}
                {menu.title}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {breadcrumbLinks?.length > 0 && (
        <PageBreadcrumbs links={breadcrumbLinks}/>
      )}

      <div className="relative ml-auto flex-1 md:grow-0">
        <SearchComboBox/>
      </div>

      <UserDropDownNav/>
    </header>
  )
}