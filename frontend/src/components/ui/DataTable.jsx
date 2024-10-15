import React, { useState } from "react";
import axios from "axios";
import {
  flexRender,
  getCoreRowModel,
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
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Check, Eye } from "lucide-react";
import { DataTablePagination } from "../data-table/DataTablePagination";
import { DataTableToolbar } from "../data-table/DataTableToolbar";
import { ReportDetailsDialog } from "../elements/report-details-modal";
import { ConfirmAssignDialog } from "../elements/confirm-assign-modal";

export function DataTable({ columns, data, activeTab, userInfo }) {
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
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleRowClick = (row) => {
    setDialogData(row.original);
    setShowDetailsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setShowDetailsDialogOpen(false);
    setDialogData(null);
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
    console.log('ID', reportId)
    try {
      await axios.put(`/api/reports/seen/${reportId}`);
      // toast.success("Report marked as seen!");
    } catch (error) {
      console.error("Error marking report as seen:", error);
      toast.error("Failed to mark report as seen. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      {!(activeTab === "unassigned") && (
        <DataTableToolbar table={table} activeTab={activeTab} />
      )}
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

                  {userInfo === undefined && (
                    <TableCell>
                    <div className="flex justify-end">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={async (event) => {
                                event.stopPropagation();
                                await setAsSeen(row.original._id); // Mark the report as seen
                                setDialogData(row.original);
                                setShowDetailsDialogOpen(true); // Open details dialog
                              }}
                              className="flex items-center"
                            >
                              <Eye size={15} className="mr-0" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View Details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                  )}

                  {activeTab === "unassigned" && (
                    <TableCell>
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(event) => {
                            event.stopPropagation(); // Prevent row click
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
        onClose={handleCloseDialog}
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
