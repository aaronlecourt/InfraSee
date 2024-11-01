import React, { useState, useEffect } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { TrashIcon, Plus, Download, UserRoundPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RegisterForm } from "@/components/elements/register-form";
import { SubModRegisterForm } from "../elements/submod-register-form";
import { CalendarDatePicker } from "../elements/calendar-date-picker";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import { fetchFilterOptions } from "./fetchFilterOptions";
import { ConfirmHideDialog } from "../elements/hide-confirm-modal";
import { ConfirmRestoreDialog } from "../elements/restore-confirm-modal";
import axios from "axios";
import { toast } from "sonner";
import { exportExcel } from "@/lib/exportUtils";

export function DataTableToolbar({
  userInfo,
  table,
  activeTab,
  activeButton,
}) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubModDialogOpen, setIsSubModDialogOpen] = useState(false);
  const [isHideDialogOpen, setIsHideDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: new Date(),
  });

  const [filterOptions, setFilterOptions] = useState({
    infraType: [],
    reportMod: [],
    reportStatus: [],
  });

  const handleDateSelect = ({ from, to }) => {
    setDateRange({ from, to });
    table.getColumn("createdAt")?.setFilterValue([from, to]);
    table.getColumn("hidden_at")?.setFilterValue([from, to]);
    table.getColumn("request_time")?.setFilterValue([from, to]);
  };

  const handleReset = () => {
    setDateRange({ from: new Date(), to: new Date() });
    table.resetColumnFilters();
  };

  const handleHideReports = async () => {
    const reportIds = selectedRows.map((report) => report.original._id).join(",");
    const count = selectedRows.length;
    try {
      await axios.put(`/api/reports/hide/${reportIds}`);
      toast.success(`${count} report${count > 1 ? "s" : ""} hidden successfully.`);
    } catch (error) {
      toast.error("Error hiding reports. Please try again.");
    } finally {
      setIsHideDialogOpen(false);
    }
  };

  const handleRestoreReports = async () => {
    const reportIds = selectedRows.map((report) => report.original._id).join(",");
    const count = selectedRows.length;
    try {
      await axios.put(`/api/reports/restore/${reportIds}`);
      toast.success(`${count} report${count > 1 ? "s" : ""} restored successfully.`);
    } catch (error) {
      toast.error("Error restoring reports. Please try again.");
    } finally {
      setIsRestoreDialogOpen(false);
    }
  };


  useEffect(() => {
    const initializeData = async () => {
      const options = await fetchFilterOptions();
      setFilterOptions(options);
      console.log("Fetched Filter Options:", options.reportStatus);
    };
    initializeData();
  }, []);

  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-2">
        <div className="col-span-1 flex gap-x-2">
          {(userInfo.isModerator || userInfo.isSubModerator) &&
            (activeTab === "reports" || activeTab === "hidden") && (
              <Input
                placeholder="Filter reporter name..."
                value={table.getColumn("report_by")?.getFilterValue() ?? ""}
                className="h-9"
                onChange={(event) => {
                  table.getColumn("report_by")?.setFilterValue(event.target.value);
                }}
              />
            )}
          {userInfo.isModerator && activeTab === "unassigned" && (
            <>
              <Input
                placeholder="Filter reporter name..."
                value={table.getColumn("report_by")?.getFilterValue() ?? ""}
                className="h-9"
                onChange={(event) => {
                  table.getColumn("report_by")?.setFilterValue(event.target.value);
                }}
                onFocus={() => {
                  table.resetColumnFilters();
                }}
              />
              <Input
                placeholder="Search reporter id..."
                value={table.getColumn("_id")?.getFilterValue() || ""}
                className="h-9 hidden"
                onChange={() => {}}
              />
            </>
          )}
          {userInfo.isAdmin && activeButton === "accounts" && (
            <Input
              placeholder="Filter by Moderator Name"
              value={table.getColumn("name")?.getFilterValue() ?? ""}
              className="h-9"
              onChange={(event) => {
                table.getColumn("name")?.setFilterValue(event.target.value);
              }}
            />
          )}
          {userInfo.isAdmin && activeButton === "reports" && (
            <Input
              placeholder="Filter reporter name..."
              value={table.getColumn("report_by")?.getFilterValue() ?? ""}
              className="h-9"
              onChange={(event) => {
                table.getColumn("report_by")?.setFilterValue(event.target.value);
              }}
            />
          )}
          <div className="flex gap-2 sm:hidden">
            <DataTableViewOptions table={table} />
            <Button size="filter" className="flex" onClick={() => exportExcel(table.getFilteredRowModel().rows, userInfo, activeTab, activeButton)}>
              <Download size={15} />
              <p className="hidden md:block">CSV</p>
            </Button>
          </div>
        </div>
        <div className="col-span-1">
          <CalendarDatePicker
            date={dateRange}
            onDateSelect={handleDateSelect}
            onReset={handleReset}
            variant="outline"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-y-2">
        <div className="col-span-1 flex items-center justify-between">
          <div className="flex items-center">
            {userInfo.isModerator && (activeTab === "reports" || activeTab === "hidden") && (
              <DataTableFacetedFilter
                column={table.getColumn("report_status")}
                title="Status"
                options={filterOptions.reportStatus.filter(
                  (status) => status.label !== "Unassigned"
                )}
              />
            )}
            {userInfo.isSubModerator && activeTab === "reports" && (
              <DataTableFacetedFilter
                column={table.getColumn("report_status")}
                title="Status"
                options={filterOptions.reportStatus.filter((status) =>
                  ["Under Review", "For Revision", "Resolved"].includes(status.label)
                )}
              />
            )}
            {userInfo.isAdmin && activeButton === "accounts" && !(activeTab === "submoderators") && (
              <DataTableFacetedFilter
                column={table.getColumn("infra_type")}
                title="Infrastructure Type"
                options={filterOptions.infraType}
              />
            )}
            {userInfo.isAdmin && activeButton === "accounts" && activeTab === "submoderators" && (
              <div className="flex gap-2">
                <DataTableFacetedFilter
                  column={table.getColumn("infra_type")}
                  title="Infrastructure Type"
                  options={filterOptions.infraType}
                />
                <DataTableFacetedFilter
                  column={table.getColumn("assignedModerator")}
                  title="Assigned to"
                  options={filterOptions.reportMod}
                />
              </div>
            )}
            {userInfo.isAdmin && activeButton === "reports" && (
              <div className="flex gap-x-2">
                <DataTableFacetedFilter
                  column={table.getColumn("report_mod")}
                  title="Moderator"
                  options={filterOptions.reportMod}
                />
                <DataTableFacetedFilter
                  column={table.getColumn("report_status")}
                  title="Status"
                  options={filterOptions.reportStatus}
                />
              </div>
            )}
            {isFiltered && (
              <Button
                variant="ghost"
                onClick={handleReset}
                className="h-8 px-2 lg:px-3 ml-2"
              >
                Reset
                <Cross2Icon className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex">
            {activeTab !== "unassigned" && (
              <div className="hidden sm:flex">
                <DataTableViewOptions table={table} />
                <Button size="filter" className="flex gap-2 ml-2" onClick={() => exportExcel(table.getFilteredRowModel().rows, userInfo, activeTab, activeButton)}>
                  <Download size={15} />
                  <p className="hidden md:block">CSV</p>
                </Button>
              </div>
            )}
            <div className="flex gap-2">
              {userInfo.isModerator && table.getFilteredSelectedRowModel().rows.length > 0 && activeTab === "hidden" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2"
                  onClick={() => setIsRestoreDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                  <p className="hidden md:block">Unhide</p>({table.getFilteredSelectedRowModel().rows.length})
                </Button>
              )}
              {userInfo.isModerator && table.getFilteredSelectedRowModel().rows.length > 0 && activeTab === "reports" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2"
                  onClick={() => setIsHideDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <p className="hidden md:block">Hide</p>({selectedRows.length})
                </Button>
              )}
              {userInfo.isAdmin && activeButton === "accounts" && (
                <>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="filter"
                        className="flex gap-2 ml-2"
                      >
                        <Plus size={15} />
                        <p className="hidden md:block">Add Moderator</p>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Moderator</DialogTitle>
                        <DialogDescription>
                          Please fill in the details below.
                        </DialogDescription>
                      </DialogHeader>
                      <RegisterForm onClose={() => setIsDialogOpen(false)} />
                    </DialogContent>
                  </Dialog>
                  <Dialog
                    open={isSubModDialogOpen}
                    onOpenChange={setIsSubModDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="filter"
                        className="flex gap-2"
                      >
                        <UserRoundPlus size={15} />
                        <p className="hidden md:block">Add Sub Moderator</p>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Sub Moderator</DialogTitle>
                        <DialogDescription>
                          Please fill in the details below.
                        </DialogDescription>
                      </DialogHeader>
                      <SubModRegisterForm
                        onClose={() => setIsSubModDialogOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <ConfirmHideDialog
        isOpen={isHideDialogOpen}
        onClose={() => setIsHideDialogOpen(false)}
        onConfirm={handleHideReports}
        reportCount={selectedRows.length}
      />
      <ConfirmRestoreDialog
        isOpen={isRestoreDialogOpen}
        onClose={() => setIsRestoreDialogOpen(false)}
        onConfirm={handleRestoreReports}
        reportCount={selectedRows.length}
      />
    </div>
  );
}
