// components/Overview.js
import React, { useEffect } from "react";
import { DataTable } from "../ui/DataTable";
export function SubReports({
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
