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
import { ArchiveIcon, Edit, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export function ModReportDataTableRowActions({ row }) {
  const [isUpdateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false);
  const [isArchiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [reportIdToArchive, setReportIdToArchive] = useState(null);

  const handleUpdateStatus = () => {
    setDialogData(row.original);
    setUpdateStatusDialogOpen(true);
  };

  const openArchiveDialog = () => {
    setReportIdToArchive(row.original._id);
    setArchiveDialogOpen(true);
  };

  const handleArchive = async () => {
    const reportId = reportIdToArchive; 
    try {
      const response = await axios.put(`/api/reports/archive/${reportId}`);
      console.log(response.data.message);
      toast.success("Report hid successfully!");
      setArchiveDialogOpen(false);
      setReportIdToArchive(null); 
    } catch (error) {
      console.error("Error hiding report:", error);
      toast.error(error.response?.data?.message || "Failed to hide report.");
    }
  };

  const handleCloseDialog = () => {
    setUpdateStatusDialogOpen(false);
    setArchiveDialogOpen(false);
    setReportIdToArchive(null); 
  };


  const handleMarkAsRead = async () => {
    const reportId = row.original._id;
    try {
      const response = await axios.put(`/api/reports/read/${reportId}`);
      toast.success(response.data.message || "Report marked as read!");
    } catch (error) {
      console.error("Error marking report as read:", error);
      toast.error(error.response?.data?.message || "Failed to mark as read.");
    }
  };

  const handleMarkAsUnread = async () => {
    const reportId = row.original._id;
    try {
      const response = await axios.put(`/api/reports/unread/${reportId}`);
      toast.success(response.data.message || "Report marked as unread!");
    } catch (error) {
      console.error("Error marking report as unread:", error);
      toast.error(error.response?.data?.message || "Failed to mark as unread.");
    }
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
          <DropdownMenuItem onClick={handleUpdateStatus} className="flex gap-2">
            <Edit size={14} className="text-muted-foreground"/>
            Update Status
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleMarkAsRead} className="flex gap-2">
            <Eye size={14} className="text-muted-foreground" />
            Mark as Read
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleMarkAsUnread} className="flex gap-2">
            <EyeOff size={14} className="text-muted-foreground" />
            Mark as Unread
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="flex gap-2"
            onClick={openArchiveDialog}
          >
            <ArchiveIcon size={14} className="text-muted-foreground"/>
            Hide Report
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
