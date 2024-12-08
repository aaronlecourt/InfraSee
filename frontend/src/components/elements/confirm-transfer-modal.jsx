import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
} from "../ui/select";

export function ConfirmTransferModal({ isOpen, onClose, onConfirm }) {
  const [infrastructureTypes, setInfrastructureTypes] = useState([]);
  const [selectedInfrastructure, setSelectedInfrastructure] = useState(null);

  useEffect(() => {
    // Fetch infrastructure types from API
    const fetchInfrastructureTypes = async () => {
      try {
        const response = await axios.get("/api/infrastructure-types");
        setInfrastructureTypes(response.data); // Assuming the API returns an array of infrastructure types
      } catch (error) {
        console.error("Error fetching infrastructure types:", error);
      }
    };

    if (isOpen) {
      fetchInfrastructureTypes();
    }
  }, [isOpen]);

  const handleSelectChange = (value) => {
    setSelectedInfrastructure(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Report Transfer</DialogTitle>
          <DialogDescription>
            Are you sure the report needs to be transferred to the selected
            infrastructure type, or do the contents of the report not align with
            this infrastructure?
          </DialogDescription>
          <Select onValueChange={handleSelectChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select the correct Infrastructure Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Transfer to</SelectLabel>
                {infrastructureTypes.length > 0 ? (
                  infrastructureTypes.map((type) => (
                    <SelectItem key={type._id} value={type._id}>
                      {type.infra_name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled>No infrastructure types available</SelectItem>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={onClose} className="mr-2">
              Cancel
            </Button>
            <Button
              onClick={() => {
                onConfirm(selectedInfrastructure);
              }}
              className="text-white"
            >
              Confirm
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
