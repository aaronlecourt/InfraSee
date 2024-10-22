// ReportCounter.js
import React from "react";
import { Badge } from "../ui/badge";

export function ReportCounter({ data, userInfo, activeTab }) {
  const getStatusCounts = (reports) => {
    const counts = {
      total: { count: 0, new: 0 },
      inprogress: { count: 0, new: 0 },
      resolved: { count: 0, new: 0 },
      dismissed: { count: 0, new: 0 },
      pending: { count: 0, new: 0 },
      unassigned: { count: 0, new: 0 },
    };

    reports.forEach((report) => {
      counts.total.count++; // Increment total count
      const status = report.report_status?.stat_name || "unknown";

      if (report.is_new) counts.total.new++; // Increment new count for total

      // Increment the count for the corresponding status
      if (status === "In Progress") {
        counts.inprogress.count++;
        if (report.is_new) counts.inprogress.new++;
      } else if (status === "Resolved") {
        counts.resolved.count++;
        if (report.is_new) counts.resolved.new++;
      } else if (status === "Dismissed") {
        counts.dismissed.count++;
        if (report.is_new) counts.dismissed.new++;
      } else if (status === "Pending") {
        counts.pending.count++;
        if (report.is_new) counts.pending.new++;
      } else if (status === "Unassigned") {
        counts.unassigned.count++;
        if (report.is_new) counts.unassigned.new++;
      } else {
        console.warn(`Unexpected report status: ${status}`);
      }
    });

    return counts;
  };

  // Get status counts from the data
  const statusCounts = getStatusCounts(data);

  // Destructure status counts for easier use
  const { total, inprogress, resolved, dismissed, pending, unassigned } = statusCounts;

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
      <Card
        title="Total Reports"
        count={total.count} // Updated to show total count
        description="All reports made"
        badgeCount={userInfo && activeTab === "overview" ? total.new : null} // Updated to show new count
      />
      <Card
        title="In Progress Reports"
        count={inprogress.count}
        description="Reports already being worked on"
        badgeCount={userInfo && activeTab === "overview" ? inprogress.new : null}
      />
      <Card
        title="Resolved Reports"
        count={resolved.count}
        description="Finished or solved reports"
        badgeCount={userInfo && activeTab === "overview" ? resolved.new : null}
      />
      <Card
        title="Unassigned Reports"
        count={unassigned.count}
        description="Reports currently handled by no one"
        badgeCount={userInfo && activeTab === "overview" ? unassigned.new : null}
      />
      <Card
        title="Pending Reports"
        count={pending.count}
        description="Pending or unseen reports"
        badgeCount={userInfo && activeTab === "overview" ? pending.new : null}
      />
    </div>
  );

  function Card({ title, count, description, badgeCount }) {
    return (
      <div className="relative border rounded-md bg-white">
        {badgeCount !== 0 && (
          <Badge className="absolute -top-2 -right-2 px-2" variant="destructive">
            {badgeCount}
          </Badge>
        )}
        <div className="p-2 flex sm:flex-col sm:p-3 items-center sm:items-start">
          <p className="text-xs sm:text-sm text-wrap">{title}</p>
          <h1 className="text-lg text-gray-300 sm:text-primary sm:text-3xl">
            {count}
          </h1>
          <small className="text-xs sm:font-normal text-gray-500 hidden sm:block sm:text-xs">
            {description}
          </small>
        </div>
      </div>
    );
  }
}
