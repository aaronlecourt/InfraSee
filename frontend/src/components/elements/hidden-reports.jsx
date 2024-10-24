import React from "react";
import { DataTable } from "../ui/DataTable";
export function HiddenReports({ userInfo, data, columns, activeTab }) {
  return (
    <div className="h-full">
      <DataTable userInfo={userInfo} data={data} columns={columns} activeTab={activeTab}/>
    </div>
  );
}
