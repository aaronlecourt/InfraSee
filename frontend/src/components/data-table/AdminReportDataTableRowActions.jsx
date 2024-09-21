"use client";

import { useState } from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReportDetailsDialog } from "../elements/report-details-modal"; // Import the dialog
import { ConfirmDeleteDialog } from "../elements/delete-confirm-modal"; // Import the delete dialog
import { Edit, Eye, Trash2 } from "lucide-react";

export function AdminReportDataTableRowActions({ row }) {
  const [isShowDetailsDialogOpen, setShowDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState(null);

  const handleShowDetails = () => {
    setDialogData(row.original); // Set the current row data
    setShowDetailsDialogOpen(true);
  };

  const handleDelete = () => {
    console.log("Deleting report:", dialogData); // Implement your delete logic here
    setDeleteDialogOpen(false);
  };

  const handleEdit = () => {
    console.log("Editing report:", dialogData); // Implement your edit logic here
    setDeleteDialogOpen(false);
  };

  const handleCloseDialog = () => {
    setShowDetailsDialogOpen(false);
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
          <DropdownMenuItem onClick={handleEdit} className="flex gap-2">
            <Edit size={14} />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleShowDetails} className="flex gap-2">
            <Eye size={14} />
            Show Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 flex gap-2"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 size={14} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ReportDetailsDialog
        isOpen={isShowDetailsDialogOpen}
        onClose={handleCloseDialog}
        data={dialogData}
      />
      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleDelete}
      />
    </>
  );
}
