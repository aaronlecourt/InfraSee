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

export function AccountDetailsDialog({ isOpen, onClose, data }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Account Details</DialogTitle>
          <DialogDescription>
            {data ? (
              <div className="flex flex-col gap-y-1">
                <div className="flex justify-between items-center pt-2">
                  <p className="text-base font-bold text-primary leading-tight">
                    {data.account_name}
                  </p>
                  <p className="text-primary">{data.account_status}</p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center justify-between gap-1">
                    <UserCircleIcon size={15} />
                    {data.account_owner}
                  </div>
                  <p>{data.account_number}</p>
                </div>
                <div className="w-full pt-2 text-primary flex flex-col gap-y-1">
                  <p>Email: {data.email}</p>
                  <p>Phone: {data.phone}</p>
                  <p>Address: {data.address}</p>
                  <div className="flex gap-3 text-muted-foreground text-xs font-normal">
                    <p>Created On: {data.created_at}</p>
                    <p>Last Active: {data.last_active}</p>
                  </div>
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
