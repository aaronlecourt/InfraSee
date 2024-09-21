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
import { AccountDetailsDialog } from "../elements/account-details-modal";
import { ConfirmDeleteDialog } from "../elements/delete-confirm-modal"; // Import the delete dialog
import { Edit, Eye, Trash2 } from "lucide-react"; // Import icons

export function AdminAccountDataTableRowActions({ row }) {
  const [isShowDetailsDialogOpen, setShowDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState(null);
console.log(row.original)
  const handleShowDetails = () => {
    setDialogData(row.original); // Set the current row data
    setShowDetailsDialogOpen(true);
  };

  const handleDelete = () => {
    console.log("Deleting account:", dialogData); // Implement your delete logic here
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
          <DropdownMenuItem onClick={() => console.log("Edit")} className="flex gap-2">
            <Edit size={14} />
            Edit Account
          </DropdownMenuItem>
          {/* <DropdownMenuItem onClick={handleShowDetails} className="flex gap-2">
            <Eye size={14} />
            Show Details
          </DropdownMenuItem> */}
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

      <AccountDetailsDialog
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
