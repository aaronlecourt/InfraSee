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
import { UpdateStatusDialog } from "../elements/update-status-modal";
import { ConfirmArchiveDialog } from "../elements/archive-confirm-modal";

export function ModReportDataTableRowActions({ row }) {
  const [isShowDetailsDialogOpen, setShowDetailsDialogOpen] = useState(false);
  const [isUpdateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false);
  const [isArchiveDialogOpen, setArchiveDialogOpen] = useState(false); // State for the archive dialog
  const [dialogData, setDialogData] = useState(null);

  const handleShowDetails = () => {
    setDialogData(row.original);
    setShowDetailsDialogOpen(true);
  };

  const handleUpdateStatus = () => {
    setDialogData(row.original);
    setUpdateStatusDialogOpen(true);
  };

  const handleArchive = () => {
    console.log("Archiving report:", dialogData); // Implement your archiving logic here
    setArchiveDialogOpen(false);
  };

  const handleCloseDialog = () => {
    setShowDetailsDialogOpen(false);
    setUpdateStatusDialogOpen(false);
    setArchiveDialogOpen(false); // Close the archive dialog as well
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
          <DropdownMenuItem onClick={handleUpdateStatus}>Update Status</DropdownMenuItem>
          <DropdownMenuItem onClick={handleShowDetails}>
            Show Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-yellow-500" 
            onClick={() => setArchiveDialogOpen(true)} // Open the archive dialog
          >
            Archive
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ReportDetailsDialog 
        isOpen={isShowDetailsDialogOpen} 
        onClose={handleCloseDialog} 
        data={dialogData} 
      />
      <UpdateStatusDialog
        isOpen={isUpdateStatusDialogOpen}
        onClose={handleCloseDialog}
        data={dialogData}
      />
      <ConfirmArchiveDialog
        isOpen={isArchiveDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleArchive} // Pass the archive handler
      />
    </>
  );
}
