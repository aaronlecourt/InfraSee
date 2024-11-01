import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { DataTablePagination } from "../data-table/DataTablePagination";
import { DataTableToolbar } from "../data-table/DataTableToolbar";
import { ReportDetailsDialog } from "../elements/report-details-modal";
import { ConfirmAssignDialog } from "../elements/confirm-assign-modal";

export function DataTable({
  userInfo,
  columns,
  data,
  activeTab,
  activeButton,
  selectedNotificationId
}) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);

  const [isShowDetailsDialogOpen, setShowDetailsDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [dialogData, setDialogData] = useState(null);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    getRowId: row => row._id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // Effect to select the row matching selectedNotificationId
  useEffect(() => {
    if (selectedNotificationId) {
      const rowToSelect = data.find(row => row._id === selectedNotificationId);
      if (rowToSelect) {
        setRowSelection({ [rowToSelect._id]: true });
      }
    }
  }, [selectedNotificationId, data]);

  const handleCloseDialog = (reportId) => {
    setShowDetailsDialogOpen(false);
    setDialogData(null);

    // Call setAsSeen after closing the dialog
    if (reportId) {
      setAsSeen(reportId);
    }
  };

  const handleOpenConfirmDialog = (report) => {
    setSelectedReport(report);
    setConfirmDialogOpen(true);
  };

  const handleAccept = async () => {
    if (selectedReport) {
      try {
        const response = await axios.put(
          `/api/reports/accept/${selectedReport._id}`
        );
        console.log("Response:", response.data);
        toast.success("Report assigned successfully!");
      } catch (error) {
        console.error("Error assigning report:", error);
        toast.error("Failed to assign the report. Please try again.");
      }
    }
    setConfirmDialogOpen(false);
    setSelectedReport(null);
  };

  const setAsSeen = async (reportId) => {
    console.log("Setting as seen for ID:", reportId);
    try {
      const response = await axios.put(`/api/reports/seen/${reportId}`);
      console.log("Response from setting as seen:", response.data);
    } catch (error) {
      console.error("Error marking report as seen:", error);
      toast.error("Failed to mark report as seen. Please try again.");
    }
  };

  return (
    <div className="space-y-2">
      <DataTableToolbar
        userInfo={userInfo}
        table={table}
        activeTab={activeTab}
        activeButton={activeButton}
      />

      <div className="overflow-y-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className="px-4 py-2"
                    key={header.id}
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  className="hover:bg-gray-100"
                >
                  {row.getVisibleCells().map((cell) => {
                    const cellContent = flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    );
                    return (
                      <TableCell className="px-4 py-2" key={cell.id}>
                        <div className="max-w-40 overflow-hidden truncate whitespace-nowrap">
                          {cellContent}
                        </div>
                      </TableCell>
                    );
                  })}
                  {activeTab === "unassigned" && (
                    <TableCell>
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleOpenConfirmDialog(row.original);
                          }}
                          className="flex items-center mr-2"
                        >
                          <Check size={15} className="mr-1" /> Accept Report
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />

      <ReportDetailsDialog
        isOpen={isShowDetailsDialogOpen}
        onClose={() => handleCloseDialog(dialogData?._id)}
        data={dialogData}
      />
      <ConfirmAssignDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleAccept}
      />
    </div>
  );
}
