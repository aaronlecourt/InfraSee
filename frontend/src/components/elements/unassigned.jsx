import React, { useState, useEffect } from "react";
import { DataTable } from "../ui/DataTable";
export function Unassigned({
  userInfo,
  data,
  columns,
  activeTab,
  selectedNotificationId,
  setSelectedNotificationId,
}) {
  useEffect(() => {
    setSelectedNotificationId(null);
  }, [activeTab]);
  return (
    <div className="h-full">
      <DataTable
        data={data}
        userInfo={userInfo}
        columns={columns}
        activeTab={activeTab}
        selectedNotificationId={selectedNotificationId}
        setSelectedNotificationId={setSelectedNotificationId}
      />
    </div>
  );
}
