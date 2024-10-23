import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { format, isValid } from "date-fns";
import {
  ZapIcon,
  DropletIcon,
  TrainTrackIcon,
  SatelliteDish,
  BuildingIcon,
} from "lucide-react";
import { AdminAccountDataTableRowActions } from "../AdminAccountDataTableRowActions";

// Helper function to format date using date-fns
const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (!isValid(date)) {
    return "Invalid date";
  }
  return format(date, "MMMM dd, yyyy");
};

export const columnsSubMod = [
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
    accessorKey: "name",
    title: "Moderator Name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Moderator Name" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("name")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "email",
    title: "Email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email Address" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("email")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "infra_type",
    title: "Infrastructure Type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Infrastructure Type" />
    ),
    cell: ({ row }) => (
      <div className="">{row.getValue("infra_type")?.infra_name || "N/A"}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "assignedModerator",
    title: "Assigned to",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assigned to" />
    ),
    cell: ({ row }) => (
      <div className="">{row.getValue("assignedModerator") || "N/A"}</div>
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
    filterFn: (row, id, value) => {
      const rowDate = new Date(row.getValue(id));
      const [startDate, endDate] = value;
      return rowDate >= startDate && rowDate <= endDate;
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <AdminAccountDataTableRowActions row={row} />,
  },
];
