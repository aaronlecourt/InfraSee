import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, 'MMMM dd, yyyy'); // Corrected to use 'mm' for minutes and 'ss' for seconds
};

const handleAccept = (data) => {
  // ASK FOR Confitm SET report_mod to the logged in user id, SET TO PENDING, SEND SMS AND MARK is_new TO true (para new pending)
  console.log(data)
}

export const columnsModUnassigned = [
  {
    accessorKey: "is_new",
    title: "",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="" />
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        {row.getValue("is_new") && (
          <Badge variant="outline" className="w-full">New</Badge>
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
    cell: ({ row }) => (
      <div className="">{row.getValue("report_by")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
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
    enableSorting: false,
    enableHiding: false,
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
    enableSorting: false,
    enableHiding: false,
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
    enableSorting: false,
    enableHiding: false,
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
    enableSorting: false,
    enableHiding: false,
  },  
];
