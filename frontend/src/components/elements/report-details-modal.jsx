"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserCircleIcon } from "lucide-react";

export function ReportDetailsDialog({ isOpen, onClose, data }) {
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
                      {/* <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white to-transparent"></div> */}
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
                <div className="flex justify-between items-center">
                  <div className="flex items-center justify-between gap-1">
                    <UserCircleIcon size={15} />
                    {data.report_by}
                  </div>
                  <p>{data.account_num}</p>
                </div>
                <div className="w-full pt-2 text-primary flex flex-col gap-y-1">
                  <p>{data.report_address}</p>
                  <div className="flex gap-3 text-muted-foreground text-xs font-normal">
                    <p>LAT: {data.latitude}</p>
                    <p>LNG: {data.longitude}</p> 
                  </div>
                </div>
              </div>
            ) : (
              <p>No data available.</p>
            )}
          </DialogDescription>
        </DialogHeader>
        {/* <Button onClick={onClose}>Close</Button> */}
      </DialogContent>
    </Dialog>
  );
}
