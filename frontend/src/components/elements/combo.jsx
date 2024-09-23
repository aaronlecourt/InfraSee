import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty, CommandGroup } from "@/components/ui/command";
import { ChevronsUpDownIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Drawer, DrawerContent, DrawerTrigger, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

export function ComboBoxResponsive({ onSelect }) {
  const [infrastructureTypes, setInfrastructureTypes] = useState([]);
  const [moderatorsByType, setModeratorsByType] = useState({});
  const [selectedModerator, setSelectedModerator] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDesktop, setIsDesktop] = useState(window.matchMedia("(min-width: 768px)").matches);

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
          const infraId = mod.infra_type._id; // Ensure infra_type has _id
          if (!acc[infraId]) {
            acc[infraId] = [];
          }
          acc[infraId].push(mod);
          return acc;
        }, {});
        setModeratorsByType(categorizedModerators);
      } catch (error) {
        console.error("Failed to fetch moderators", error);
      }
    };

    fetchInfrastructureTypes();
    fetchModerators();

    const handleResize = () => {
      setIsDesktop(window.matchMedia("(min-width: 768px)").matches);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleModeratorSelect = (moderator) => {
    setSelectedModerator(moderator._id);
    if (onSelect) {
      onSelect(moderator);
    }
    setOpen(false);
  };

  const getFilteredModerators = () => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return Object.entries(moderatorsByType).reduce((acc, [infraId, moderators]) => {
      const filteredMods = moderators.filter(mod =>
        mod.name.toLowerCase().includes(lowerSearchTerm)
      );
      if (filteredMods.length > 0) {
        acc[infraId] = filteredMods;
      }
      return acc;
    }, {});
  };

  const filteredModeratorsByType = getFilteredModerators();
  const selectedModeratorName = Object.values(moderatorsByType).flat().find(mod => mod._id === selectedModerator)?.name;

  const renderContent = () => (
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
              <CommandItem className="font-bold text-xs cursor-default" disabled>
                {infrastructureTypes.find(infra => infra._id === infraId)?.infra_name || "Unknown Infrastructure"}
              </CommandItem>
              <CommandGroup>
                {moderators.map((mod) => (
                  <CommandItem
                    key={mod._id}
                    onSelect={() => handleModeratorSelect(mod)}
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
  );

  if (isDesktop) {
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
          {renderContent()}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className="text-wrap h-auto justify-between"
        >
          {selectedModeratorName || "Select Moderator"}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="hidden">
          <DrawerTitle>Report form</DrawerTitle>
          <DrawerDescription>Fill up the form</DrawerDescription>
        </DrawerHeader>
        <div className="mt-4 border-t">
          {renderContent()}
        </div>
      </DrawerContent>
    </Drawer>
  );
}