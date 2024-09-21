"use client";

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
import { ReportDetailsDialog } from "../elements/report-details-modal";
import { ConfirmDeleteDialog } from "../elements/delete-confirm-modal";
import { ConfirmRestoreDialog } from "../elements/restore-confirm-modal";
import { EyeIcon, ArchiveRestore, Trash2 } from "lucide-react";

export function ModArchiveDataTableRowActions({ row }) {
  const [isShowDetailsDialogOpen, setShowDetailsDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState(null);

  const handleShowDetails = () => {
    setDialogData(row.original);
    setShowDetailsDialogOpen(true);
  };

  const handleRestore = () => {
    console.log("Restoring report:", dialogData); // Implement your restore logic here
    setRestoreDialogOpen(false);
  };

  const handleDelete = () => {
    console.log("Deleting report:", dialogData); // Implement your delete logic here
    setDeleteDialogOpen(false);
  };

  const handleCloseDialog = () => {
    setShowDetailsDialogOpen(false);
    setRestoreDialogOpen(false);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={handleShowDetails} className="flex gap-2">
            <EyeIcon size={14} />
            Show Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setRestoreDialogOpen(true)}
            className="flex gap-2"
          >
            <ArchiveRestore size={14} />
            Restore
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-500 flex gap-2"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 size={14} /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ReportDetailsDialog
        isOpen={isShowDetailsDialogOpen}
        onClose={handleCloseDialog}
        data={dialogData}
      />
      <ConfirmRestoreDialog
        isOpen={isRestoreDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleRestore} // Pass the restore handler
      />
      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleDelete} // Pass the delete handler
      />
    </>
  );
}
