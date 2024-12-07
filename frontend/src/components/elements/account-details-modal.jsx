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
                    {data.name}
                  </p>
                  <p className="text-primary">{data.isModerator ? "Moderator" : "Sub Moderator"}</p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center justify-between gap-1">
                    <UserCircleIcon size={15} />
                    {data.email}
                  </div>
                </div>
                <div className="w-full pt-2 text-primary flex flex-col gap-y-1">
                  {/* <p>Email: {data.email}</p> */}
                  {data.infra_type?.infra_name && (
                    <p>Infrastructure Type: {data.infra_type?.infra_name}</p>
                  )}
                  <div className="flex gap-3 text-muted-foreground text-xs font-normal">
                    <p>Created On: {new Date(data.createdAt).toLocaleString()}</p>
                    <p>Last Updated: {new Date(data.updatedAt).toLocaleString()}</p>
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
