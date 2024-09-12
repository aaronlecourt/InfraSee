import { Button } from '@/components/ui/button';
import { MoreHorizontal, CopyIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

// Helper function to format date using date-fns
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, 'MMMM dd, yyyy hh:mm a'); // Customize the format as needed
};

// Define columns with actions, sorting, and filtering
export const columnsAccounts = [
  {
    accessorKey: 'name',
    header: 'Moderator Name',
  },
  {
    accessorKey: 'email',
    header: 'Email Address'
  },
  {
    accessorKey: 'infra_name',
    header: 'Infrastructure Type',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created at',
    cell: ({ row }) => {
      return formatDate(row.getValue('createdAt'));
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const account = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(account._id)} className="gap-2">
              <CopyIcon size={15} />
              Copy Account ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Details</DropdownMenuItem>
            {/* Add other action items here */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
