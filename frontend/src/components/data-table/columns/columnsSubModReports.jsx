import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { SubModReportDataTableRowActions } from "../SubModReportDataTableRowActions";
import { Badge } from "@/components/ui/badge";

// Helper function to format date using date-fns
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "MMM dd yyyy, hh:mm aa"); // Corrected to use 'mm' for minutes and 'ss' for seconds
};

export const columnsSubModReports = [
  {
    accessorKey: "submod_id",
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="" />,
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
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
      <DataTableColumnHeader column={column} title="Reported By" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("report_by")}</div>,
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
      <div className="">{row.getValue("report_mod")?.name || "Unassigned"}</div> // Access the 'name' field
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
    cell: ({ row }) => <div className="">"{row.getValue("report_desc")}"</div>,
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
      <Badge className="px-2" variant="default">
        {row.getValue("report_status")?.stat_name || "Unknown"}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue("report_status")?._id);
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "report_address",
    title: "Address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("report_address")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "request_time",
    title: "Requested Last",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Requested Last" />
    ),
    cell: ({ row }) => (
      <div className="">{row.getValue("request_time") ? formatDate(row.getValue("request_time")) : "N/A"}</div>
    ),
    filterFn: (row, id, value) => {
      const rowDate = new Date(row.getValue(id));
      const [startDate, endDate] = value;
      return rowDate >= startDate && rowDate <= endDate;
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "report_time_resolved",
    title: "Resolved on",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Resolved on" />
    ),
    cell: ({ row }) => (
      <div className="">{row.getValue("report_time_resolved") ? formatDate(row.getValue("report_time_resolved")) : "N/A"}</div>
    ),
    
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <SubModReportDataTableRowActions row={row} />,
  },
];
