import React from "react";
import { DataTable } from "../ui/DataTable";
export function HiddenReports({ data, columns, activeTab }) {
  return (
    <div className="h-full">
      <DataTable data={data} columns={columns} activeTab={activeTab}/>
    </div>
  );
}
