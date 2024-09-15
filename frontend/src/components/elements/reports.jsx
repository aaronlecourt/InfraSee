// components/Overview.js
import React from "react";
import { DataTable } from "../ui/DataTable";
import { columnsModReports } from "../data-table/columns/columnsModReports";
export function Reports({data, columns}) {
  return (
    <div className="h-full">
      <DataTable data={data} columns={columns} />
    </div>
  );
}
