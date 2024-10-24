// components/Overview.js
import React from "react";
import { DataTable } from "../ui/DataTable";
export function SubReports({userInfo, data, columns, activeTab, highlightedId, setHighlightedId}) {
  console.log(userInfo)
  return (
    <div className="h-full">
      <DataTable userInfo={userInfo} data={data} columns={columns} activeTab={activeTab} highlightedId={highlightedId} setHighlightedId={setHighlightedId}/>
    </div>
  );
}
