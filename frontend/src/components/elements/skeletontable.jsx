"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronsUpDown } from "lucide-react";

export function SkeletonTable({ columns }) {
  return (
    <div className="space-y-4">
      <div className="overflow-y-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {/* Checkbox for selection */}
              <TableHead className="py-2">
                <Skeleton className="h-4 w-4" />
              </TableHead>
              {columns.map((column, index) => (
                <TableHead className="px-2 py-2" key={`${column.accessor}-${index}`}>
                  <div className="flex gap-2">
                    <Skeleton className="h-4" />
                    <ChevronsUpDown size={12} />
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {/* Placeholder for the checkbox */}
                <TableCell className="px-4 py-4">
                  <Skeleton className="h-4 w-4" />
                </TableCell>
                {columns.map((column, colIndex) => (
                  <TableCell className="px-4 py-2" key={`${column.accessor}-${colIndex}`}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
