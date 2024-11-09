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
import { ArchiveIcon, Edit, Eye, EyeOff, LucideGalleryHorizontal, LucideGalleryThumbnails, LucideGalleryVertical, LucideGalleryVerticalEnd } from "lucide-react";
import { toast } from "sonner";

export function ModReportDataTableRowActions({ row }) {
  const [isUpdateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false);
  const [isShowDetailsDialogOpen, setShowDetailsDialogOpen] = useState(false);
  const [isHideDialogOpen, setHideDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [reportIdToHide, setReportIdToHide] = useState(null);


  const handleUpdateStatus = () => {
    setDialogData(row.original);
    setUpdateStatusDialogOpen(true);
  };

  const openHideDialog = () => {
    setReportIdToHide(row.original._id);
    setHideDialogOpen(true);
  };

  const handleHide = async () => {
    const reportIds = reportIdToHide; // Make sure this is a comma-separated string
    console.log("Hiding reports with IDs:", reportIds);
    
    try {
      const response = await axios.put(`/api/reports/hide/${reportIds}`);
      console.log("Success response:", response.data.message);
      toast.success("Reports hidden successfully!");
      setHideDialogOpen(false);
      setReportIdToHide(null);
    } catch (error) {
      console.error("Error hiding reports:", error);
      const errorMessage = error.response?.data?.message || "Failed to hide reports.";
      console.error("Displayed error message:", errorMessage);
      toast.error(errorMessage); // Show the specific error message as a toast
    }
  };
  
  const handleShowDetails = () => {
    setDialogData(row.original);
    setShowDetailsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setShowDetailsDialogOpen(false);
    setUpdateStatusDialogOpen(false);
    setHideDialogOpen(false);
    setReportIdToHide(null);
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
          <DropdownMenuItem onClick={handleShowDetails} className="flex gap-2">
            <LucideGalleryVerticalEnd size={14} className="text-muted-foreground" />
            Show Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {row.original.report_status.stat_name != "Resolved" &&
            row.original.report_status.stat_name != "Dismissed" && (
              <>
                <DropdownMenuItem
                  onClick={handleUpdateStatus}
                  className="flex gap-2"
                >
                  <Edit size={14} className="text-muted-foreground" />
                  Update Status
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
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

          
          {(row.original.report_status?.stat_name === "Resolved" ||
            row.original.report_status?.stat_name === "Dismissed") && (
              <>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex gap-2" onClick={openHideDialog}>
                <ArchiveIcon size={14} className="text-muted-foreground" />
                Hide Report
              </DropdownMenuItem>
              </>
            )}
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateStatusDialog
        isOpen={isUpdateStatusDialogOpen}
        onClose={handleCloseDialog}
        data={dialogData}
      />
      <ReportDetailsDialog
        isOpen={isShowDetailsDialogOpen}
        onClose={handleCloseDialog}
        data={dialogData}
      />
      <ConfirmHideDialog
        isOpen={isHideDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleHide}
      />
    </>
  );
}
