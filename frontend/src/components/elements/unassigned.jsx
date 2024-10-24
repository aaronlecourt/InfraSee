import React, { useState } from "react";
import { DataTable } from "../ui/DataTable";
export function Unassigned({
  userInfo,
  data,
  columns,
  activeTab,
  highlightedId,
  setHighlightedId,
}) {
  return (
    <div className="h-full">
      <DataTable
        data={data}
        userInfo={userInfo}
        columns={columns}
        activeTab={activeTab}
        highlightedId={highlightedId}
        setHighlightedId={setHighlightedId}
      />
    </div>
  );
}
