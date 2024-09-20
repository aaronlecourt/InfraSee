import React from "react";
import { DataTable } from "../ui/DataTable";
export function Archives({ data, columns }) {
  return (
    <div className="h-full">
      <DataTable data={data} columns={columns} />
    </div>
  );
}
