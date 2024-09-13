import { useState } from "react";
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

  const handleDateSelect = ({ from, to }) => {
    setDateRange({ from, to });
    table.getColumn("date")?.setFilterValue([from, to]);
  };

  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-end">
        <div className="flex items-center gap-2">
          <div>
          <CalendarDatePicker
            date={dateRange}
            onDateSelect={handleDateSelect}
            className="h-9 w-[250px]"
            variant="outline"
          />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <Input
            placeholder="Filter account name..."
            value={table.getColumn("name")?.getFilterValue() ?? ""}
            onChange={(event) => {
              table.getColumn("name")?.setFilterValue(event.target.value);
            }}
            className="h-9 w-[150px] lg:w-[250px]"
          />
          {table.getColumn("infra_name") && (
            <DataTableFacetedFilter
              column={table.getColumn("infra_name")}
              title="Infrastructure Type"
              options={[
                { label: "Power and Energy", value: "Power and Energy" },
                { label: "Water and Waste", value: "Water and Waste" },
                { label: "Transportation", value: "Transportation" },
                { label: "Telecommunications", value: "Telecommunications" },
                { label: "Commercial", value: "Commercial" },
                // Add other types here
              ]}
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
          <div>
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
                {/* register form component here */}
                <RegisterForm />
                <DialogClose onClick={() => setIsDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
          <DataTableViewOptions table={table} />
          <Button size="filter"className=" flex gap-2">
            <Download size={15}/>Export CSV
          </Button>
        </div>
      </div>
    </div>
  );
}
