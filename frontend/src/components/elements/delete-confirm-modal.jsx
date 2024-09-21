"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ConfirmDeleteDialog({ isOpen, onClose, onConfirm }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this report? This action cannot be undone.
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
