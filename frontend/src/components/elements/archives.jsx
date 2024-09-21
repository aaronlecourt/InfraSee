import React from "react";
import { DataTable } from "../ui/DataTable";
export function Archives({ data, columns, activeTab }) {
  return (
    <div className="h-full">
      <DataTable data={data} columns={columns} activeTab={activeTab}/>
    </div>
  );
}
