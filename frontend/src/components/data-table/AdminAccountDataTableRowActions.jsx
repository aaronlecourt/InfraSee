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
import { ConfirmDeactivateDialog } from "../elements/deactivate-confirm-modal";
import { Edit, Eye, RefreshCcw, Trash2 } from "lucide-react";
import { useDeactivateModeratorMutation, useReactivateModeratorMutation } from "@/slices/users-api-slice";
import { ConfirmReactivateDialog } from "../elements/reactivate-confirm-modal";

export function AdminAccountDataTableRowActions({ row }) {
  const [isShowDetailsDialogOpen, setShowDetailsDialogOpen] = useState(false);
  const [isDeactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [isReactivateDialogOpen, setReactivateDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const userId = row.original._id;

  const [deactivateModerator] = useDeactivateModeratorMutation();
  const [reactivateModerator] = useReactivateModeratorMutation();

  const handleShowDetails = () => {
    setDialogData(row.original);
    setShowDetailsDialogOpen(true);
  };

  const handleDeactivate = async () => {
    try {
      await deactivateModerator(userId);
      console.log("Account deactivated:", userId);
      setDeactivateDialogOpen(false);
    } catch (error) {
      console.error("Error deactivating account:", error);
    }
  };

  const handleReactivate = async () => {
    try {
      await reactivateModerator(userId);
      console.log("Account reactivated:", userId);
      setReactivateDialogOpen(false);
    } catch (error) {
      console.error("Error reactivating account:", error);
    }
  };

  const handleCloseDialog = () => {
    setShowDetailsDialogOpen(false);
    setDeactivateDialogOpen(false);
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
          {row.original.deactivated ? (
            <DropdownMenuItem
            className="text-green-600 flex gap-2"
            onClick={() => setReactivateDialogOpen(true)}
          >
            <RefreshCcw size={14} />
            Reactivate
            </DropdownMenuItem>
          ):(
            
            <DropdownMenuItem
            className="text-red-600 flex gap-2"
            onClick={() => setDeactivateDialogOpen(true)}
          >
            <Trash2 size={14} />
            Deactivate
          </DropdownMenuItem>
          )}
          
        </DropdownMenuContent>
      </DropdownMenu>

      <AccountDetailsDialog
        isOpen={isShowDetailsDialogOpen}
        onClose={handleCloseDialog}
        data={dialogData}
      />
      <ConfirmDeactivateDialog
        isOpen={isDeactivateDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleDeactivate}
      />
      <ConfirmReactivateDialog
        isOpen={isReactivateDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleReactivate}
      />
    </>
  );
}
