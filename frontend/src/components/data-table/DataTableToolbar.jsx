import React, { useState, useEffect } from "react";
import axios from "axios";
import { Cross2Icon } from "@radix-ui/react-icons";
import { TrashIcon, Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { RegisterForm } from "@/components/elements/register-form";
import { CalendarDatePicker } from "../elements/calendar-date-picker";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { DataTableFacetedFilter } from "./DataTableFacetedFilter";

export function DataTableToolbar({ table }) {
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

  const handleDateSelect = ({ from, to }) => {
    setDateRange({ from, to });
    table.getColumn("createdAt")?.setFilterValue([from, to]);
  };

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [infraTypeResponse, reportModResponse, reportStatusResponse] = await Promise.all([
          axios.get('/api/infrastructure-types'),
          axios.get('/api/users/moderators'),
          axios.get('/api/status')
        ]);

        setFilterOptions({
          infraType: infraTypeResponse.data.map(type => ({ label: type.infra_name, value: type.infra_name })),
          reportMod: reportModResponse.data.map(mod => ({ label: mod.name, value: mod.name })),
          reportStatus: reportStatusResponse.data.map(status => ({ label: status.stat_name, value: status.stat_name })),
        });
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchFilterOptions();
  }, []);

  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-end mb-2">
        <div className="flex items-center">
          <CalendarDatePicker
            date={dateRange}
            onDateSelect={handleDateSelect}
            className="h-9 w-[250px]"
            variant="outline"
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {table.getColumn("name") && (
            <Input
              placeholder="Search moderator name..."
              value={table.getColumn("name")?.getFilterValue() ?? ""}
              onChange={(event) => {
                table.getColumn("name")?.setFilterValue(event.target.value);
              }}
              className="h-9 w-[150px] lg:w-[250px]"
            />
          )}
          {table.getColumn("report_by") && (
            <Input
              placeholder="Search reporter name..."
              value={table.getColumn("report_by")?.getFilterValue() ?? ""}
              onChange={(event) => {
                table.getColumn("report_by")?.setFilterValue(event.target.value);
              }}
              className="h-9 w-[150px] lg:w-[250px]"
            />
          )}
          {table.getColumn("infra_type") && (
            <DataTableFacetedFilter
              column={table.getColumn("infra_type")}
              title="Infrastructure Type"
              options={filterOptions.infraType}
            />
          )}
          {table.getColumn("report_mod") && (
            <>
              <DataTableFacetedFilter
                column={table.getColumn("report_mod")}
                title="Report Moderator"
                options={filterOptions.reportMod}
              />
              <DataTableFacetedFilter
                column={table.getColumn("report_status")}
                title="Status"
                options={filterOptions.reportStatus}
              />
            </>
          )}
          {table.getColumn("report_by") && !table.getColumn("report_mod") && (
            <DataTableFacetedFilter
            column={table.getColumn("report_status")}
            title="Status"
            options={filterOptions.reportStatus}
          />
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

        <div className="flex items-center gap-2">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button variant="outline" size="sm">
              <TrashIcon className="mr-2 h-4 w-4" aria-hidden="true" />
              Delete ({table.getFilteredSelectedRowModel().rows.length})
            </Button>
          )}
          {table.getColumn("infra_type") && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="filter1"
                  size="filter"
                  className="flex items-center gap-2"
                >
                  <Plus size={15} />
                  <p>New Account</p>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Account</DialogTitle>
                  <DialogDescription>
                    Add a new moderator account by filling up the form below.
                    Click add when you're done.
                  </DialogDescription>
                </DialogHeader>
                <RegisterForm />
                <DialogClose onClick={() => setIsDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          )}
          <DataTableViewOptions table={table} />
          <Button size="filter" className=" flex gap-2">
            <Download size={15} />
            CSV
          </Button>
        </div>
      </div>
    </div>
  );
}
