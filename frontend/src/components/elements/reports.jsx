import React, { useState, useEffect } from "react";
import { DataTable } from "../ui/DataTable";

export function Reports({ userInfo, data, columns, activeTab, selectedNotificationId, setSelectedNotificationId }) {
  useEffect(() => {
    setSelectedNotificationId(null);
  }, [activeTab]);

  return (
    <div className="h-full">
      <DataTable
        userInfo={userInfo}
        data={data}
        columns={columns}
        activeTab={activeTab}
        selectedNotificationId={selectedNotificationId}
        setSelectedNotificationId={setSelectedNotificationId}
      />
    </div>
  );
}
