import React from "react";
import { FileIcon } from "lucide-react";

function ReportCard({ report }) {
  return (
    <div className="border rounded-md px-4 py-2 mb-2 flex gap-3 items-center cursor-pointer hover:opacity-100 hover:shadow-md opacity-45 transition-shadow duration-300">
      <FileIcon />
      <div className="w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold">{report.report_by}</h2>
          <p className="text-xs font-semibold">
            {report.report_status?.stat_name}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">"{report.report_desc}"</p>
      </div>
    </div>
  );
}

export default ReportCard;
