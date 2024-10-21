"use client";
import axios from "axios";
import { useState } from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UpdateStatusDialog } from "../elements/update-status-modal";
import { ConfirmArchiveDialog } from "../elements/archive-confirm-modal";
import { LucideGalleryVerticalEnd, Eye, EyeOff } from "lucide-react";
import { toast } from 'sonner';

export function ModUnassignedDataTableRowActions({ row }) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem className="flex gap-2">
            <Eye size={14} className="text-muted-foreground"/>
            Mark as Read
          </DropdownMenuItem>
          <DropdownMenuItem className="flex gap-2">
            <EyeOff size={14} className="text-muted-foreground"/>
            Mark as Unread
          </DropdownMenuItem>

          <DropdownMenuSeparator/>
          <DropdownMenuItem className="flex gap-2">
            <LucideGalleryVerticalEnd size={14} className="text-muted-foreground"/>
            Show Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
