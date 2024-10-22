// DataTableToolbar.js
import React, { useState, useEffect } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import {
  TrashIcon,
  Plus,
  Download,
} from "lucide-react";
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
import { CalendarDatePicker } from "../elements/calendar-date-picker";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import { fetchFilterOptions } from "./fetchFilterOptions"; // Import the function

export function DataTableToolbar({
  table,
  activeTab,
  highlightedId,
  setHighlightedId,
}) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });
  
  const [filterOptions, setFilterOptions] = useState({
    infraType: [],
    reportMod: [],
    reportStatus: [],
  });
  console.log("Filter Options:", filterOptions.reportStatus)

  const handleDateSelect = ({ from, to }) => {
    setDateRange({ from, to });
    table.getColumn("createdAt")?.setFilterValue([from, to]);
  };

  useEffect(() => {
    const initializeData = async () => {
      const options = await fetchFilterOptions();
      setFilterOptions(options);
    };
    initializeData();
  }, []);

  useEffect(() => {
    if (activeTab === "unassigned" && highlightedId) {
      table.getColumn("_id")?.setFilterValue(highlightedId);
    }
  }, [activeTab, highlightedId, table]);

  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-2">
        <div className="col-span-1 flex gap-x-2">
          {(activeTab === "reports" || activeTab === "hidden") && (
            <Input
              placeholder="Search reporter name..."
              value={table.getColumn("report_by")?.getFilterValue() ?? ""}
              className="h-9"
              onChange={(event) => {
                table.getColumn("report_by")?.setFilterValue(event.target.value);
              }}
            />
          )}
          {activeTab === "unassigned" && (
            <>
              <Input
                placeholder="Search reporter name..."
                value={table.getColumn("report_by")?.getFilterValue() ?? ""}
                className="h-9"
                onChange={(event) => {
                  table.getColumn("report_by")?.setFilterValue(event.target.value);
                }}
                onFocus={() => {
                  setHighlightedId();
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
          {activeTab === undefined && table.getColumn("name") && (
            <Input
              placeholder="Search moderator name..."
              value={table.getColumn("name")?.getFilterValue() ?? ""}
              className="h-9"
              onChange={(event) => {
                table.getColumn("name")?.setFilterValue(event.target.value);
              }}
            />
          )}
          <div className="flex gap-2 sm:hidden">
            <DataTableViewOptions table={table} />
            <Button size="filter" className="flex gap-2">
              <Download size={15} />
              <p className="hidden md:block">CSV</p>
            </Button>
          </div>
        </div>
        <div className="col-span-1">
          <CalendarDatePicker
            date={dateRange}
            onDateSelect={handleDateSelect}
            variant="outline"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-y-2">
        <div className="col-span-1 flex items-center justify-between">
          <div className="flex items-center">
            {activeTab === "reports" && table.getColumn("report_by") && !table.getColumn("report_mod") && (
              <DataTableFacetedFilter
                column={table.getColumn("report_status")}
                title="Status"
                options={filterOptions.reportStatus}
              />
            )}
            {activeTab === undefined && table.getColumn("infra_type") && (
              <DataTableFacetedFilter
                column={table.getColumn("infra_type")}
                title="Infrastructure Type"
                options={filterOptions.infraType}
              />
            )}
            {table.getColumn("report_mod") && (
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
                onClick={() => table.resetColumnFilters()}
                className="h-9 px-2 lg:px-3"
              >
                Reset
                <Cross2Icon className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex gap-x-2">
            {activeTab !== "unassigned" && activeTab !== "hidden" && (
              <div className="hidden gap-2 sm:flex">
                <DataTableViewOptions table={table} />
                <Button size="filter" className="flex gap-2">
                  <Download size={15} />
                  <p className="hidden md:block">CSV</p>
                </Button>
              </div>
            )}
            <div className="flex gap-x-2">
              {table.getFilteredSelectedRowModel().rows.length > 0 && activeTab === undefined && (
                <Button
                  variant="outline"
                  size="filter"
                  className="flex gap-2"
                >
                  <TrashIcon size={15} aria-hidden="true" />
                  <p className="hidden md:block">Delete</p>(
                  {table.getFilteredSelectedRowModel().rows.length})
                </Button>
              )}
              {table.getFilteredSelectedRowModel().rows.length > 0 && activeTab === "archives" && (
                <Button
                  variant="outline"
                  size="filter"
                  className="flex gap-2"
                >
                  <TrashIcon size={15} aria-hidden="true" />
                  <p className="hidden md:block">Delete</p>(
                  {table.getFilteredSelectedRowModel().rows.length})
                </Button>
              )}
              {table.getFilteredSelectedRowModel().rows.length > 0 && activeTab === "archives" && (
                <Button variant="outline" size="sm">
                  <Plus
                    className="mr-2 h-4 w-4"
                    aria-hidden="true"
                  />
                  <p className="hidden md:block">Unhide</p>(
                  {table.getFilteredSelectedRowModel().rows.length})
                </Button>
              )}
              {table.getFilteredSelectedRowModel().rows.length > 0 && activeTab === "reports" && (
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                  <p className="hidden md:block">Hide</p>(
                  {table.getFilteredSelectedRowModel().rows.length})
                </Button>
              )}
              {table.getColumn("infra_type") && activeTab === undefined && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="filter"
                      className="flex gap-2"
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
