"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "MMM dd yyyy @ hh:mm:ss aa"); // Corrected to use 'mm' for minutes and 'ss' for seconds
};

export function ConfirmAcceptDialog({ isOpen, onClose, onConfirm, data }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Confirm Time Resolved</DialogTitle>
          <DialogDescription>
            {data ? (
              <>
               Is the report <span className="font-bold">{data.report_desc}</span> by <span className="font-bold">{data.report_by}</span> truly resolved by <span className="font-bold">{data.report_mod?.name}</span> last <span className="font-bold">{formatDate(data.report_time_resolved)}</span>? Select 'Confirm' if true.
              </>
            ) : (
              <>Is the report's time resolved correct and accurate? Select 'Confirm' if true.</>
            )}
          </DialogDescription>
          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={onClose} className="mr-2">
              Cancel
            </Button>
            <Button onClick={onConfirm} className="text-white">
              Confirm
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
