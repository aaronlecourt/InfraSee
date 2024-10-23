"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "MMM dd yyyy @ hh:mm:ss aa"); // Corrected to use 'mm' for minutes and 'ss' for seconds
};

export function ConfirmRejectDialog({ isOpen, onClose, onConfirm, data }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirm Report Rejection</DialogTitle>
          <DialogDescription>
            {data ? (
              <>
                Are you sure you want to reject the report <span className="font-bold">{data.report_desc}</span> by <span className="font-bold">{data.report_by}</span>? This action will mark the report as "For Revision" and notify the user.
                <br />
                <span className="font-bold">Report Resolved Time:</span> {formatDate(data.report_time_resolved)} {/* Using report_time_resolved */}
              </>
            ) : (
              <>Are you sure you want to reject this report? This action cannot be undone.</>
            )}
          </DialogDescription>
          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={onClose} className="mr-2">
              Cancel
            </Button>
            <Button onClick={onConfirm} className="text-white">
              Reject
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
