"use client";

import { useState } from "react";
import axios from "axios";
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
import { ConfirmDeleteDialog } from "../elements/delete-confirm-modal";
import { Edit, Eye, Trash2 } from "lucide-react";

export function AdminAccountDataTableRowActions({ row }) {
  const [isShowDetailsDialogOpen, setShowDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const userId = row.original._id; 
  
  const handleShowDetails = () => {
    setDialogData(row.original);
    setShowDetailsDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/users/delete/${userId}`);
      console.log("Account deleted:", dialogData);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting account:", error);
    }
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
          {/* <DropdownMenuItem
            onClick={() => console.log("Edit")}
            className="flex gap-2"
          >
            <Edit size={14} />
            Edit Account
          </DropdownMenuItem> */}
          {/* <DropdownMenuItem onClick={handleShowDetails} className="flex gap-2">
            <Eye size={14} />
            Show Details
          </DropdownMenuItem> */}
          {/* <DropdownMenuSeparator /> */}
          <DropdownMenuItem
            className="text-red-600 flex gap-2"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 size={14} />
            Deactivate
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
