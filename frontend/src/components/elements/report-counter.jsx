import React from "react";

export function ReportCounter({
  total_reps,
  inprog_reps,
  resolved_reps,
  dismissed_reps,
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="border rounded-md p-2 flex justify-between sm:flex-col sm:p-3 items-center sm:items-start">
        <p className="text-xs sm:text-sm text-wrap">Total Reports</p>
        <h1 className="text-lg text-gray-300 sm:text-primary sm:text-3xl">{total_reps}</h1>
        <small className="text-xs sm:font-normal text-gray-500 hidden sm:block sm:text-xs">
          All reports made
        </small>
      </div>
      <div className="border rounded-md p-2 flex justify-between sm:flex-col sm:p-3 items-center sm:items-start">
        <p className="text-xs sm:text-sm text-wrap">In Progress Reports</p>
        <h1 className="text-lg text-gray-300 sm:text-primary sm:text-3xl">{inprog_reps}</h1>
        <small className="text-xs sm:font-normal text-gray-500 hidden sm:block sm:text-xs">
          Reports already being worked on
        </small>
      </div>
      <div className="border rounded-md p-2 flex justify-between sm:flex-col sm:p-3 items-center sm:items-start">
        <p className="text-xs sm:text-sm text-wrap">Resolved Reports</p>
        <h1 className="text-lg text-gray-300 sm:text-primary sm:text-3xl">{resolved_reps}</h1>
        <small className="text-xs sm:font-normal text-gray-500 hidden sm:block sm:text-xs">
          Finished or solved reports
        </small>
      </div>
      <div className="border rounded-md p-2 flex justify-between sm:flex-col sm:p-3 items-center sm:items-start">
        <p className="text-xs sm:text-sm text-wrap">Dismissed Reports</p>
        <h1 className="text-lg text-gray-300 sm:text-primary sm:text-3xl">{dismissed_reps}</h1>
        <small className="text-xs sm:font-normal text-gray-500 hidden sm:block sm:text-xs">
          False or unreliable reports
        </small>
      </div>
    </div>
  );
}
