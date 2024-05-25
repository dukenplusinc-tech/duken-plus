'use client';

import {FC} from "react";
import Link from "next/link";

import {
  MoreVertical,
  Smartphone,
  TrashIcon
} from "lucide-react"

import {Issue} from "@/lib/entities/issues/schema";

import {Button} from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {Separator} from "@/components/ui/separator"
import {Badge} from "@/components/ui/badge";

import {CopyIssueId} from "@/lib/entities/issues/containers/issue-card/copy-id";

import {useDeleteIssueWithConfirm} from "@/lib/entities/issues/hooks/useDeleteIssueWithConfirm";

import * as fromUrl from "@/lib/url/generator";

export const IssueCard: FC<{ issue: Issue }> = ({issue}) => {
  const handleRemove = useDeleteIssueWithConfirm(issue.id)

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5 mr-2">
          <CardTitle className="group flex items-center gap-2 text-lg">
            {issue.id}
            <CopyIssueId id={issue.id}/>
          </CardTitle>
          <CardDescription>Date: {issue.created_at}</CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Link target={issue?.device?.device_id ? '_blank' : '_top'}
                href={issue?.device?.device_id ? fromUrl.toDashboardDevice(issue.url!, issue?.device?.device_id) : '#'}>
            <Button size="sm" variant="outline" className="h-8 gap-1" disabled={!issue?.device?.device_id}>
              <Smartphone className="h-3.5 w-3.5"/>
              <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
              View Device
            </span>
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="h-8 w-8">
                <MoreVertical className="h-3.5 w-3.5"/>
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="h-8 gap-1" onClick={handleRemove}><TrashIcon className="h-3.5 w-3.5"/> Remove</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3 mb-2">
          <div className="font-semibold">Issue title</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {issue.title}
              </span>
            </li>
          </ul>
        </div>
        <Separator className="my-4"/>
        <div className="grid gap-3 mb-2">
          <div className="font-semibold">Details</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-start">
              <span className="text-muted-foreground mr-2">
                {issue.ip}
              </span>
              <Badge>{issue.country}</Badge>
            </li>

            <li className="flex items-center justify-start">
              {issue.url && <Badge variant="outline" className="mr-2">{issue.url}</Badge>}
              {issue.dashboard && <Badge variant="outline">{issue.dashboard}</Badge>}
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}


export const IssueDetailsCard: FC<{ issue: Issue }> = ({issue}) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Properties</div>
          <dl className="grid gap-3">
            {issue?.properties ? Object.entries(issue.properties).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <dt className="text-muted-foreground">{key.toUpperCase()}</dt>
                <dd>{(value as string) || ''}</dd>
              </div>
            )) : (
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">No properties provided</dt>
              </div>
            )}
          </dl>
        </div>
        <Separator className="my-4"/>
        <div className="grid gap-3 mb-2">
          <div className="font-semibold">Stack trace</div>
          <Separator className="my-2"/>
          <pre>{issue.stack ? JSON.stringify(issue.stack, null, 2) : 'No stack provided'}</pre>
        </div>
      </CardContent>
    </Card>
  )
}
