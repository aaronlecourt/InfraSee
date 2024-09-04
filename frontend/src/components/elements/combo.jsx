"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty, CommandGroup } from "@/components/ui/command";
import { ChevronsUpDownIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ComboBoxResponsive({ onSelect }) {
  const [infrastructureTypes, setInfrastructureTypes] = useState([]);
  const [moderatorsByType, setModeratorsByType] = useState({});
  const [selectedModerator, setSelectedModerator] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch infrastructure types and moderators from API
  useEffect(() => {
    const fetchInfrastructureTypes = async () => {
      try {
        const response = await axios.get("/api/infrastructure-types");
        setInfrastructureTypes(response.data);
      } catch (error) {
        console.error("Failed to fetch infrastructure types", error);
      }
    };

    const fetchModerators = async () => {
      try {
        const response = await axios.get("/api/users/moderators");
        const moderators = response.data;
        const categorizedModerators = moderators.reduce((acc, mod) => {
          if (!acc[mod.infra_type]) {
            acc[mod.infra_type] = [];
          }
          acc[mod.infra_type].push(mod);
          return acc;
        }, {});
        setModeratorsByType(categorizedModerators);
      } catch (error) {
        console.error("Failed to fetch moderators", error);
      }
    };

    fetchInfrastructureTypes();
    fetchModerators();
  }, []);

  const handleModeratorSelect = (moderatorId) => {
    setSelectedModerator(moderatorId);
    if (onSelect) {
      onSelect(moderatorId); // Notify parent component
    }
    setOpen(false);
  };

  // Filter moderators based on search term and group them by infrastructure type
  const filteredModeratorsByType = Object.entries(moderatorsByType).reduce((acc, [infraId, moderators]) => {
    const filteredMods = moderators.filter(mod =>
      mod.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filteredMods.length > 0) {
      acc[infraId] = filteredMods;
    }
    return acc;
  }, {});

  // Find the name of the selected moderator
  const selectedModeratorName = Object.values(moderatorsByType).flat().find((mod) => mod._id === selectedModerator)?.name;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className="text-wrap h-auto justify-between"
        >
          {selectedModeratorName || "Select Moderator"}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 border rounded-md">
        <Command>
          <CommandInput
            placeholder="Search moderators..."
            className="h-9"
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            {Object.keys(filteredModeratorsByType).length === 0 ? (
              <CommandEmpty>No moderators found.</CommandEmpty>
            ) : (
              Object.entries(filteredModeratorsByType).map(([infraId, moderators]) => (
                <React.Fragment key={infraId}>
                  <CommandItem
                    className="font-bold text-xs cursor-default"
                    disabled
                  >
                    {infrastructureTypes.find(infra => infra._id === infraId)?.infra_name || "Unknown Infrastructure"}
                  </CommandItem>
                  <CommandGroup>
                    {moderators.map((mod) => (
                      <CommandItem
                        key={mod._id}
                        onSelect={() => handleModeratorSelect(mod._id)}
                        className={cn(
                          "cursor-pointer",
                          selectedModerator === mod._id ? 'bg-primary text-white' : ''
                        )}
                      >
                        {mod.name}
                        {selectedModerator === mod._id && (
                          <CheckIcon className="ml-auto h-4 w-4" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </React.Fragment>
              ))
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
