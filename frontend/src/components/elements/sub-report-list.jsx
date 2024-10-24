import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SubReportCard from "./sub-report-card";

export function SubReportList({ data, setHighlightedId, goToReportsTab }) {
  return (
    <ScrollArea className="max-h-[500px] overflow-y-auto">
      {data.length === 0 ? (
        <p className="text-center text-muted-foreground text-sm">
          No reports available.
        </p>
      ) : (
        data.map((report) => (
          <SubReportCard
            key={report._id}
            report={report}
            setHighlightedId={setHighlightedId}
            goToReportsTab={goToReportsTab}
          />
        ))
      )}
    </ScrollArea>
  );
}
