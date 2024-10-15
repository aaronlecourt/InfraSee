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
import { ArchiveIcon, Edit } from "lucide-react";
import { toast } from 'sonner';

export function ModReportDataTableRowActions({ row }) {
  const [isUpdateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false);
  const [isArchiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [reportIdToArchive, setReportIdToArchive] = useState(null); // Store the report ID for archiving

  const handleUpdateStatus = () => {
    setDialogData(row.original);
    setUpdateStatusDialogOpen(true);
  };

  const openArchiveDialog = () => {
    setReportIdToArchive(row.original._id); // Set the report ID to archive
    setArchiveDialogOpen(true); // Open the archive confirmation dialog
  };

  const handleArchive = async () => {
    const reportId = reportIdToArchive; // Get the stored report ID

    try {
      const response = await axios.put(`/api/reports/archive/${reportId}`);
      console.log(response.data.message);
      toast.success("Report hid successfully!");
      setArchiveDialogOpen(false);
      setReportIdToArchive(null); // Clear the stored report ID
    } catch (error) {
      console.error("Error hiding report:", error);
      toast.error(error.response?.data?.message || "Failed to hide report.");
    }
  };

  const handleCloseDialog = () => {
    setUpdateStatusDialogOpen(false);
    setArchiveDialogOpen(false);
    setReportIdToArchive(null); // Clear the stored report ID on close
  };

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
          <DropdownMenuItem onClick={handleUpdateStatus} className="flex gap-2">
            <Edit size={14} />
            Update Status
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-yellow-500 flex gap-2"
            onClick={openArchiveDialog} // Open the archive dialog here
          >
            <ArchiveIcon size={14} />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateStatusDialog
        isOpen={isUpdateStatusDialogOpen}
        onClose={handleCloseDialog}
        data={dialogData}
      />
      <ConfirmArchiveDialog
        isOpen={isArchiveDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleArchive}
      />
    </>
  );
}
