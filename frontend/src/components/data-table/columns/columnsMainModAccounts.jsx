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

const infraTypeIcons = {
  "Power and Energy": <ZapIcon size={15} color="rgba(0,0,0,0.5)" />,
  "Water and Waste": <DropletIcon size={15} color="rgba(0,0,0,0.5)" />,
  Transportation: <TrainTrackIcon size={15} color="rgba(0,0,0,0.5)" />,
  Telecommunications: <SatelliteDish size={15} color="rgba(0,0,0,0.5)" />,
  Commercial: <BuildingIcon size={15} color="rgba(0,0,0,0.5)" />,
};

// Helper function to format date using date-fns
const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (!isValid(date)) {
    return "Invalid date";
  }
  return format(date, "MMMM dd, yyyy");
};

export const columnsMainModAccounts = [
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
  //   {
  //   accessorKey: "infra_type",
  //   title: "Infrastructure Type",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Infrastructure Type" />
  //   ),
  //   cell: ({ row }) => (
  //     <div className="">{row.getValue("infra_type")?.infra_name || "N/A"}</div>
  //   ),
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue("infra_type")?._id);
  //   },
  //   enableSorting: true,
  //   enableHiding: true,
  // },

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
