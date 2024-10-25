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
import { ReportDetailsDialog } from "../elements/report-details-modal";
import { UpdateStatusDialog } from "../elements/update-status-modal";
import { ConfirmHideDialog } from "../elements/hide-confirm-modal";
import { ArchiveIcon, Check, Edit, Eye, EyeOff, LucideGalleryVerticalEnd, X } from "lucide-react";
import { toast } from "sonner";
import { ConfirmAcceptDialog } from "../elements/accept-confirm-modal";
import { ConfirmRejectDialog } from "../elements/reject-confirm-modal";

export function SubModReportDataTableRowActions({ row }) {
  const [isAcceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [isRejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [isShowDetailsDialogOpen, setShowDetailsDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState(null);

  const handleAccept = () => {
    setDialogData(row.original);
    setAcceptDialogOpen(true);
  };

  const handleReject = () => {
    setDialogData(row.original);
    setRejectDialogOpen(true);
  };

  const handleConfirm = async () => {
    const reportId = dialogData?._id;
    if (!reportId) {
      toast.error("No report with that ID was found. Please try again.");
      return;
    }

    try {
      // Send approval request with isAccepted set to true
      const response = await axios.put(`/api/reports/approval/${reportId}`, {
        isAccepted: true,
      });
      toast.success(response.data.message || "Report successfully approved!");
      setAcceptDialogOpen(false);
    } catch (error) {
      console.error("Error confirming approval:", error);
      toast.error(error.response?.data?.message || "Request has failed. Try Again.");
    }
  };
  

  const handleRejectConfirm = async () => {
    const reportId = dialogData?._id;
    if (!reportId) {
      toast.error("No report with that ID was found. Please try again.");
      return;
    }
  
    try {
      const response = await axios.put(`/api/reports/reject/${reportId}`, {
        isAccepted: false, // Pass false to indicate rejection
      });
      toast.success(response.data.message || "Report successfully rejected!");
      setRejectDialogOpen(false);
    } catch (error) {
      console.error("Error rejecting approval:", error);
      toast.error(error.response?.data?.message || "Request has failed. Try Again.");
    }
  };
  
  const handleShowDetails = () => {
    setDialogData(row.original);
    setShowDetailsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setShowDetailsDialogOpen(false);
    setAcceptDialogOpen(false);
    setRejectDialogOpen(false);
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
          <DropdownMenuItem
            onClick={handleAccept}
            className="flex gap-2 text-green-600"
          >
            <Check size={14} className="" />
            Accept
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleReject}
            className="flex gap-2 text-red-600"
          >
            <X size={14} className="" />
            Reject
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleShowDetails} className="flex gap-2">
            <LucideGalleryVerticalEnd size={14} className="text-muted-foreground" />
            Show Details
          </DropdownMenuItem>
          {row.original.is_new ? (
            <DropdownMenuItem onClick={handleMarkAsRead} className="flex gap-2">
              <Eye size={14} className="text-muted-foreground" />
              Mark as Read
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={handleMarkAsUnread}
              className="flex gap-2"
            >
              <EyeOff size={14} className="text-muted-foreground" />
              Mark as Unread
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmAcceptDialog
        isOpen={isAcceptDialogOpen}
        onConfirm={handleConfirm}
        onClose={handleCloseDialog}
        data={dialogData}
      />
      <ConfirmRejectDialog
        isOpen={isRejectDialogOpen}
        onConfirm={handleRejectConfirm}
        onClose={handleCloseDialog}
        data={dialogData}
      />
      <ReportDetailsDialog
        isOpen={isShowDetailsDialogOpen}
        onClose={handleCloseDialog}
        data={dialogData}
      />
    </>
  );
}
