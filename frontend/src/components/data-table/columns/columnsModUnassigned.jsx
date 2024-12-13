import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ModUnassignedDataTableRowActions } from "../ModUnassignedDataTableActions";
import { differenceInSeconds, addSeconds, parseISO } from "date-fns";
import { useState, useEffect } from "react";

// Define EXPIRATION_TIME in seconds (3 days)
const EXPIRATION_TIME = 3 * 24 * 60 * 60; // 3 days in seconds (259,200 seconds)

// Helper function to format dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "MMMM dd, yyyy hh:mm aa");
};

const LiveCountdownCell = ({ createdAt }) => {
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!createdAt) return;

    // Parse the createdAt date
    const createdAtDate = parseISO(createdAt);
    const expiresAt = addSeconds(createdAtDate, EXPIRATION_TIME); // Add expiration time

    const updateCountdown = () => {
      const now = new Date();
      const diffInSeconds = differenceInSeconds(expiresAt, now);

      if (diffInSeconds <= 0) {
        setCountdown("Expired");
        clearInterval(intervalId);
      } else {
        setCountdown(diffInSeconds);
      }
    };

    // Update the countdown every second
    const intervalId = setInterval(updateCountdown, 1000);

    // Cleanup interval when component is unmounted or createdAt changes
    return () => clearInterval(intervalId);
  }, [createdAt]);

  // Format the countdown in a readable way
  if (countdown === "Expired") {
    return <Badge variant="destructive2" className="text-[0.65rem] px-2 rounded-sm">Expired</Badge>;
  }

  // Manually calculate days, hours, minutes, and seconds
  const days = Math.floor(countdown / (60 * 60 * 24));
  const hours = Math.floor((countdown % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((countdown % (60 * 60)) / 60);
  const seconds = countdown % 60;

  // Construct a human-readable string
  let timeString = '';
  if (days > 0) timeString += `${days} day${days > 1 ? 's' : ''} `;
  if (hours > 0 || days > 0) timeString += `${hours} hr${hours > 1 ? 's' : ''} `;
  if (minutes > 0 || hours > 0 || days > 0) timeString += `${minutes} min${minutes > 1 ? 's' : ''} `;
  timeString += `${seconds} sec${seconds > 1 ? 's' : ''}`;

  return <div>{timeString}</div>;
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
      <DataTableColumnHeader
        column={column}
        title="Status"
        className="text-[0.75rem]"
      />
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
    accessorKey: "createdAt", // Using createdAt and adding 3 days (EXPIRATION_TIME)
    title: "Expires In",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Expires In"
        className="text-[0.75rem]"
      />
    ),
    cell: ({ row }) => <LiveCountdownCell createdAt={row.getValue("createdAt")} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <ModUnassignedDataTableRowActions row={row} />,
  },
];
