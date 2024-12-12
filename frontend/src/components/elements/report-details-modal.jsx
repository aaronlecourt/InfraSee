"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PhoneCall, UserCircleIcon } from "lucide-react";
import { Maximize } from "lucide-react"; // Import the Maximize icon
import { format } from "date-fns";
import { date } from "zod";
import { Badge } from "../ui/badge";

export function ReportDetailsDialog({ isOpen, onClose, data }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "MMMM dd, yyyy hh:mm:ss aa");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Details</DialogTitle>
          <DialogDescription asChild>
            {data ? (
              <div className="flex flex-col gap-y-1">
                {data.report_img && (
                  <div className="relative h-60 w-full rounded-md overflow-hidden mt-2">
                    <img
                      src={data.report_img}
                      alt="Report related"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="ghost"
                      onClick={() => window.open(data.report_img, "_blank")}
                      className="absolute bottom-2 right-2 text-white"
                      title="View Fullscreen"
                    >
                      <Maximize size={14} />
                    </Button>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2">
                  <p className="text-base font-bold text-primary leading-tight">
                    {data.report_desc}
                  </p>
                  <p className="text-primary">
                    {data.report_status?.stat_name}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  {formatDate(data.createdAt)}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center justify-between gap-1">
                    <UserCircleIcon size={15} />
                    {data.report_by}
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <PhoneCall size={15} />
                    {data.report_contactNum}
                  </div>
                </div>
                <div className="w-full pt-2 text-primary flex flex-col gap-y-1">
                  <p>{data.report_address}</p>
                  <div className="flex gap-3 text-muted-foreground text-xs font-normal">
                    <p>LAT: {data.latitude}</p>
                    <p>LNG: {data.longitude}</p>
                  </div>
                  <br />
                  {data.request_time && (
                    <p>
                      Requested for review on: {formatDate(data.request_time)}
                    </p>
                  )}
                  {data.status_remark && <p className="flex-col flex items-start"><Badge className="bg-black mb-2 rounded-sm"><span className="px-2">Remarks</span></Badge> {data.status_remark}</p>}
                </div>
              </div>
            ) : (
              <p>No data available.</p>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
