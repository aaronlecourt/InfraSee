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
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReportDetailsDialog } from "../elements/report-details-modal"; 
import { ConfirmDeleteDialog } from "../elements/delete-confirm-modal"; 
import { Edit, Eye, Trash2 } from "lucide-react";
import { toast } from 'sonner';

export function AdminReportDataTableRowActions({ row }) {
  const [isShowDetailsDialogOpen, setShowDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleShowDetails = () => {
    setDialogData(row.original); // Set the current row data
    setShowDetailsDialogOpen(true);
  };

  const handleDelete = async () => {
    const reportId = row.original._id;
    try {
      const response = await axios.delete(`/api/reports/delete/${reportId}`);
      console.log(response.data.message);
      toast.success("Report deleted successfully!"); // Add success toast
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting report:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to delete report."
      );
      toast.error("Error deleting report."); // Add error toast
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
