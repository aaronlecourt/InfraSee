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
    header: ({ column }) => <DataTableColumnHeader column={column} title="" />,
    cell: () => null,
    enableSorting: false,
    enableHiding: false,
    enableCellSorting: false,
  },
  {
    accessorKey: "submod_is_new",
    title: "",
    header: ({ column }) => <DataTableColumnHeader column={column} title="" />,
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        {row.getValue("submod_is_new") ? (
          <Badge
            variant="outline"
            className="px-2 rounded-md border-none bg-muted-foreground text-white"
          >
            Unread
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="px-2 rounded-md border-muted-foreground/20 text-muted-foreground"
          >
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
      <>
        <DataTableColumnHeader column={column} title="Status" />
      </>
    ),
    cell: ({ row }) => {
      const status = row.getValue("report_status")?.stat_name || "Unknown";
      
      // Determine the badge color based on the status value
      let badgeColor = "";
      switch (status) {
        case "Resolved":
          badgeColor = "bg-[#16AF12] text-white"; // Green for Resolved
          break;
        case "Pending":
          badgeColor = "bg-[#FF0000] text-white"; // Red for Pending
          break;
        case "In Progress":
          badgeColor = "bg-[#000BCB] text-white"; // Blue for In Progress
          break;
        case "Dismissed":
          badgeColor = "bg-[#5A5A5A] text-white"; // Grey for Dismissed
          break;
        case "Unassigned":
          badgeColor = "bg-[#FFA500] text-white"; // Yellow for Unassigned
          break;
        case "For Revision":
          badgeColor = "bg-black text-white"; // Black for For Revision
          break;
        case "Under Review":
          badgeColor = "border border-black text-black bg-white"; // Black border for Under Review, no color
          break;
        default:
          badgeColor = "bg-gray-300 text-black"; // Default color for unknown status
          break;
      }
  
      return (
        <Badge className={`px-2 rounded-md ${badgeColor}`}>
          {status}
        </Badge>
      );
    },
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
      <div className="">
        {row.getValue("request_time")
          ? formatDate(row.getValue("request_time"))
          : "N/A"}
      </div>
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
      <div className="">
        {row.getValue("report_time_resolved")
          ? formatDate(row.getValue("report_time_resolved"))
          : "N/A"}
      </div>
    ),

    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <SubModReportDataTableRowActions row={row} />,
  },
];
