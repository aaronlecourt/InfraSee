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
    header: ({ column }) => <DataTableColumnHeader column={column} title="" />,
    cell: () => null,
    enableSorting: false,
    enableHiding: false,
    enableCellSorting: false,
  },
  {
    accessorKey: "is_new",
    title: "",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title=""
        className="text-[0.75rem]"
      />
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        {row.getValue("is_new") ? (
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
      <DataTableColumnHeader
        column={column}
        title="Reported By"
        className="text-[0.75rem]"
      />
    ),
    cell: ({ row }) => <div className="">{row.getValue("report_by")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "report_desc",
    title: "Description",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Description"
        className="text-[0.75rem]"
      />
    ),
    cell: ({ row }) => <div className="">"{row.getValue("report_desc")}"</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "report_status",
    title: "Status",
    header: ({ column }) => (
      <>
        <DataTableColumnHeader column={column} title="Status" className="text-[0.75rem]"/>
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
    enableSorting: false,
    enableHiding: false,
  }, 
  {
    accessorKey: "report_address",
    title: "Address",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Address"
        className="text-[0.75rem]"
      />
    ),
    cell: ({ row }) => <div className="">{row.getValue("report_address")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "createdAt",
    title: "Created On",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Created On"
        className="text-[0.75rem]"
      />
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
