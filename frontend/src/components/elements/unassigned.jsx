import React, { useState } from "react";
import { DataTable } from "../ui/DataTable";
export function Unassigned({
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
        columns={columns}
        activeTab={activeTab}
        highlightedId={highlightedId}
        setHighlightedId={setHighlightedId}
      />
    </div>
  );
}
