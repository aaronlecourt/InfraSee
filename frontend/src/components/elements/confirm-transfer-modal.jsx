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

// Fetching the list of available infrastructure types
const fetchInfrastructureTypes = async () => {
  try {
    const response = await axios.get("/api/infrastructure-types");
    return response.data;
  } catch (error) {
    console.error("Error fetching infrastructure types:", error);
    return []; // Return empty array on error
  }
};

export function ConfirmTransferModal({
  isOpen,
  onClose,
  onConfirm,
  selectedInfraType, // The previously selected infrastructure type
  reportId, // The reportId that we are updating
}) {
  const [infrastructureTypes, setInfrastructureTypes] = useState([]);
  const [selectedInfrastructure, setSelectedInfrastructure] = useState(selectedInfraType);
  const [loadingInfrastructureType, setLoadingInfrastructureType] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSelectChange = (value) => {
    setSelectedInfrastructure(value);
  };

  useEffect(() => {
    // Update selectedInfrastructure when selectedInfraType prop changes
    setSelectedInfrastructure(selectedInfraType);
  }, [selectedInfraType]);

  useEffect(() => {
    // Fetch infrastructure types when modal is opened
    const fetchData = async () => {
      if (isOpen) {
        setLoadingInfrastructureType(true); 
        const fetchedInfrastructureTypes = await fetchInfrastructureTypes();
        setInfrastructureTypes(fetchedInfrastructureTypes);
        setLoadingInfrastructureType(false);
      }
    };

    fetchData();
  }, [isOpen]);

  const handleConfirm = async () => {
    try {
      if (!selectedInfrastructure) {
        setErrorMessage("Please select an infrastructure type.");
        return;
      }

      await onConfirm(selectedInfrastructure, reportId);
      onClose(); 
    } catch (error) {
      console.error("Error updating infrastructure type:", error);
      setErrorMessage("Failed to update infrastructure type. Please try again.");
    }
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

          {/* Select input for infrastructure types */}
          <Select value={selectedInfrastructure} onValueChange={handleSelectChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Infrastructure Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Infrastructure Types</SelectLabel>
                {loadingInfrastructureType ? (
                  <SelectItem disabled>Loading...</SelectItem> // Show loading state
                ) : infrastructureTypes.length > 0 ? (
                  infrastructureTypes.map((type) => (
                    <SelectItem key={type._id} value={type._id}>
                      {type.infra_name} {/* Displaying the infrastructure name */}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled>No infrastructure types available</SelectItem>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Error message if infraType selection is not made */}
          {errorMessage && (
            <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
          )}

          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={() => onClose(false)} className="mr-2">
              Cancel
            </Button>
            <Button
              onClick={handleConfirm} // Confirm the infrastructure type change
              className="text-white"
            >
              Transfer
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
