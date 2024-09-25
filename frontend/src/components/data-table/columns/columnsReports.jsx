import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { AdminReportDataTableRowActions } from "../AdminReportDataTableRowActions";

// Helper function to format date using date-fns
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, 'MMMM dd, yyyy'); // Corrected to use 'mm' for minutes and 'ss' for seconds
};

export const columnsReports = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "report_by",
    title: "Reported By",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reported By" />
    ),
    cell: ({ row }) => (
      <div className="">{row.getValue("report_by")}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "report_mod",
    title: "Moderator",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Moderator" />
    ),
    cell: ({ row }) => (
      <div className="">{row.getValue("report_mod")?.name || "N/A"}</div> // Access the 'name' field
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "report_desc",
    title: "Description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <div className="">"{row.getValue("report_desc")}"</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "report_status",
    title: "Status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div className="">{row.getValue("report_status")?.stat_name || "Unknown"}</div> // Access the stat_name field from the populated data
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "report_address",
    title: "Address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => (
      <div className="">{row.getValue("report_address")}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "createdAt",
    title: "Created On",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created On" />
    ),
    cell: ({ row }) => (
      <div className="">{formatDate(row.getValue("createdAt"))}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <AdminReportDataTableRowActions row={row} />,
  },
];
