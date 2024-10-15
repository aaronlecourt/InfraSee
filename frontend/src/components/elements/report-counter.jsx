import React from "react";

export function ReportCounter({ data }) {
  const getStatusCounts = (reports) => {
    const counts = {
      total: reports.length,
      inprogress: 0,
      resolved: 0,
      dismissed: 0,
      pending: 0,
      unassigned: 0,
    };

    reports.forEach((report) => {
      const status = report.report_status?.stat_name || "unknown";

      // Increment the count for the corresponding status
      if (status === "In Progress") {
        counts.inprogress++;
      } else if (status === "Resolved") {
        counts.resolved++;
      } else if (status === "Dismissed") {
        counts.dismissed++;
      } else if (status === "Pending") {
        counts.pending++;
      } else if (status === "Unassigned") {
        counts.unassigned++;
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
      <div className="border rounded-md p-2 flex sm:flex-col sm:p-3 items-center sm:items-start bg-white">
        <p className="text-xs sm:text-sm text-wrap">Total Reports</p>
        <h1 className="text-lg text-gray-300 sm:text-primary sm:text-3xl">
          {total}
        </h1>
        <small className="text-xs sm:font-normal text-gray-500 hidden sm:block sm:text-xs">
          All reports made
        </small>
      </div>
      <div className="border rounded-md p-2 flex sm:flex-col sm:p-3 items-center sm:items-start bg-white">
        <p className="text-xs sm:text-sm text-wrap">In Progress Reports</p>
        <h1 className="text-lg text-gray-300 sm:text-primary sm:text-3xl">
          {inprogress}
        </h1>
        <small className="text-xs sm:font-normal text-gray-500 hidden sm:block sm:text-xs">
          Reports already being worked on
        </small>
      </div>
      <div className="border rounded-md p-2 flex sm:flex-col sm:p-3 items-center sm:items-start bg-white">
        <p className="text-xs sm:text-sm text-wrap">Resolved Reports</p>
        <h1 className="text-lg text-gray-300 sm:text-primary sm:text-3xl">
          {resolved}
        </h1>
        <small className="text-xs sm:font-normal text-gray-500 hidden sm:block sm:text-xs">
          Finished or solved reports
        </small>
      </div>
      <div className="border rounded-md p-2 flex sm:flex-col sm:p-3 items-center sm:items-start bg-white">
        <p className="text-xs sm:text-sm text-wrap">Unassigned Reports</p>
        <h1 className="text-lg text-gray-300 sm:text-primary sm:text-3xl">
          {unassigned}
        </h1>
        <small className="text-xs sm:font-normal text-gray-500 hidden sm:block sm:text-xs">
          Reports currently handled by no one
        </small>
      </div>
      <div className="border rounded-md p-2 flex sm:flex-col sm:p-3 items-center sm:items-start bg-white">
        <p className="text-xs sm:text-sm text-wrap">Pending Reports</p>
        <h1 className="text-lg text-gray-300 sm:text-primary sm:text-3xl">
          {pending}
        </h1>
        <small className="text-xs sm:font-normal text-gray-500 hidden sm:block sm:text-xs">
          Pending or unseen reports
        </small>
      </div>
    </div>
  );
}
