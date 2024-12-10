import React from "react";
import { Badge } from "../ui/badge";

// Define status icons
const statusIcons = {
  Total: "/pins/pins_-08.png", // Example for total reports
  Resolved: "/pins/pins_-03.png",
  "Under Review": "/pins/pins_-07.png", // Add appropriate icon
  "For Revision": "/pins/pins_-06.png", // Add appropriate icon
  Dismissed: "/pins/pins_-05.png",
  Pending: "/pins/pins_-01.png",
  Unassigned: "/pins/pins_-04.png",
  "In Progress": "/pins/pins_-02.png",
};

export function SubReportCounter({ data, userInfo, activeTab }) {
  const getStatusCounts = (reports) => {
    const counts = {
      total: { count: 0, new: 0 },
      resolved: { count: 0, new: 0 },
      underReview: { count: 0, new: 0 },
      forRevision: { count: 0, new: 0 },
      dismissed: { count: 0, new: 0 },
      pending: { count: 0, new: 0 },
      unassigned: { count: 0, new: 0 },
      inProgress: { count: 0, new: 0 },
    };

    reports.forEach((report) => {
      counts.total.count++; // Increment total count
      const status = report.report_status?.stat_name || "unknown";

      if (report.submod_is_new) counts.total.new++; // Increment new count for total

      // Increment the count for the corresponding status
      switch (status) {
        case "Resolved":
          counts.resolved.count++;
          if (report.submod_is_new) counts.resolved.new++;
          break;
        case "Under Review":
          counts.underReview.count++;
          if (report.submod_is_new) counts.underReview.new++;
          break;
        case "For Revision":
          counts.forRevision.count++;
          if (report.submod_is_new) counts.forRevision.new++;
          break;
        case "Dismissed":
          counts.dismissed.count++;
          if (report.submod_is_new) counts.dismissed.new++;
          break;
        case "Pending":
          counts.pending.count++;
          if (report.submod_is_new) counts.pending.new++;
          break;
        case "Unassigned":
          counts.unassigned.count++;
          if (report.submod_is_new) counts.unassigned.new++;
          break;
        case "In Progress":
          counts.inProgress.count++;
          if (report.submod_is_new) counts.inProgress.new++;
          break;
        default:
          console.warn(`Unexpected report status: ${status}`);
      }
    });

    return counts;
  };

  // Get status counts from the data
  const statusCounts = getStatusCounts(data);

  // Destructure status counts for easier use
  const { total, resolved, underReview, forRevision } = statusCounts;

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
      <Card
        title="Total Reports"
        count={total.count} // Updated to show total count
        description="All reports made"
        badgeCount={userInfo && activeTab === "overview" ? total.new : null} // Updated to show new count
        icon={statusIcons["Total"]} // Add icon for Total Reports
      />
      <Card
        title="Resolved Reports"
        count={resolved.count}
        description="Finished or solved reports"
        badgeCount={userInfo && activeTab === "overview" ? resolved.new : null}
        icon={statusIcons["Resolved"]}
      />
      <Card
        title="Under Review Reports"
        count={underReview.count} // Display Under Review count
        description="Reports currently under review"
        badgeCount={userInfo && activeTab === "overview" ? underReview.new : null}
        icon={statusIcons["Under Review"]}
      />
      <Card
        title="For Revision Reports"
        count={forRevision.count} // Display For Revision count
        description="Reports needing revision"
        badgeCount={userInfo && activeTab === "overview" ? forRevision.new : null}
        icon={statusIcons["For Revision"]}
      />
    </div>
  );

  function Card({ title, count, description, badgeCount, icon }) {
    return (
      <div className="relative border rounded-md bg-white">
        {badgeCount !== 0 && (
          <Badge className="absolute -top-2 -right-2 px-2" variant="destructive">
            {badgeCount}
          </Badge>
        )}
        <div className="p-2 flex sm:p-3 items-center justify-between sm:items-start">
          <div>
            <p className="text-xs sm:text-sm text-wrap">{title}</p>
            <h1 className="text-lg text-gray-300 sm:text-primary sm:text-3xl">{count}</h1>
            <small className="text-xs sm:font-normal text-gray-500 hidden sm:block sm:text-xs">
              {description}
            </small>
          </div>
          <div>
            <img src={icon} alt={`${title} icon`} className="h-10 mr-3 object-contain" />
          </div>
        </div>
      </div>
    );
  }
}
