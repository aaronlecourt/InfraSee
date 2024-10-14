import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReportCard from './report-card';

export function ReportList({ data }) {

  return (
    <ScrollArea className="max-h-[500px] overflow-y-auto">
      {data.length === 0 ? (
        <p className="text-center text-muted-foreground text-sm">No reports available.</p>
      ) : (
        data.map((report) => (
          <ReportCard key={report._id} report={report} />
        ))
      )}
    </ScrollArea>
  );
}
