import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ModUnassignedDataTableRowActions } from "../ModUnassignedDataTableActions";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "MMMM dd, yyyy");
};

export const columnsModUnassigned = [
  {
    accessorKey: "_id",
    title: "",
    header: ({ column }) => <DataTableColumnHeader column={column} title=""/>,
    cell: () => null,
    enableSorting: false,
    enableHiding: false,
    enableCellSorting: false,
  },
  {
    accessorKey: "is_new",
    title: "",
    header: ({ column }) => <DataTableColumnHeader column={column} title="" className="text-[0.75rem]"/>,
    cell: ({ row }) => (
      <div className="">
        {row.getValue("is_new") ? (
          <Badge variant="outline" className="w-full rounded-md border-muted-foreground/20 text-muted-foreground">
            Unread
          </Badge>
        ) : (
          <Badge variant="outline" className="w-full rounded-md border-muted-foreground/20 text-muted-foreground">
            Read
          </Badge>
        )}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "report_by",
    title: "Reported By",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reported By" className="text-[0.75rem]"/>
    ),
    cell: ({ row }) => <div className="">{row.getValue("report_by")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "report_desc",
    title: "Description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" className="text-[0.75rem]"/>
    ),
    cell: ({ row }) => <div className="">"{row.getValue("report_desc")}"</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "report_status",
    title: "Status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" className="text-[0.75rem]"/>
    ),
    cell: ({ row }) => (
      <Badge className="px-2" variant="default">
        {row.getValue("report_status")?.stat_name || "Unknown"}
      </Badge>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "report_address",
    title: "Address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" className="text-[0.75rem]"/>
    ),
    cell: ({ row }) => <div className="">{row.getValue("report_address")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "createdAt",
    title: "Created On",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created On" className="text-[0.75rem]"/>
    ),
    cell: ({ row }) => (
      <div className="">{formatDate(row.getValue("createdAt"))}</div>
    ),
    filterFn: (row, id, value) => {
      const rowDate = new Date(row.getValue(id));
      const [startDate, endDate] = value;
      return rowDate >= startDate && rowDate <= endDate;
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <ModUnassignedDataTableRowActions row={row} />,
  },
];
