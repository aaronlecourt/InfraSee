import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";

// Sample data for infrastructure types and moderators
const infraTypes = [
  { value: "power_energy", label: "Power and Energy" },
  { value: "water_waste", label: "Water and Waste" },
  { value: "transportation", label: "Transportation" },
  { value: "telecommunications", label: "Telecommunications" },
  { value: "commercial", label: "Commercial" },
];

const moderators = [
  { value: "account 1", label: "Account 1", infra_type: "power_energy" },
  { value: "account 2", label: "Account 2", infra_type: "power_energy" },
  { value: "account 3", label: "Account 3", infra_type: "water_waste" },
  { value: "account 4", label: "Account 4", infra_type: "water_waste" },
  { value: "account 5", label: "Account 5", infra_type: "transportation" },
  { value: "account 6", label: "Account 6", infra_type: "transportation" },
  { value: "account 7", label: "Account 7", infra_type: "telecommunications" },
  { value: "account 8", label: "Account 8", infra_type: "telecommunications" },
  { value: "account 9", label: "Account 9", infra_type: "commercial" },
  { value: "account 10", label: "Account 10", infra_type: "commercial" },
  { value: "account 11", label: "Account 11", infra_type: "commercial" },
];

export function ComboBoxResponsive() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModerator, setSelectedModerator] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  // Handle screen size change
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Group moderators by their infrastructure type
  const groupedModerators = infraTypes.map(type => ({
    ...type,
    moderators: moderators.filter(mod => mod.infra_type === type.value),
  }));

  const handleSelectModerator = (value) => {
    setSelectedModerator(value === selectedModerator ? null : value);
    setIsOpen(false); // Close both drawer and dropdown
  };

  const triggerButtonText = selectedModerator
    ? moderators.find(mod => mod.value === selectedModerator)?.label
    : "Select Moderator";

  return (
    <div className="relative">
      {/* Drawer for mobile */}
      {isMobile ? (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" onClick={() => setIsOpen(true)}>
              {triggerButtonText}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Select Moderator</DrawerTitle>
              <DrawerClose onClick={() => setIsOpen(false)} />
            </DrawerHeader>
            <Command>
              <CommandInput placeholder="Search moderator..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {groupedModerators.map(type => (
                    <div key={type.value} className="py-2 px-4">
                      <h3 className="font-bold text-xs mb-2">{type.label}</h3>
                      {type.moderators.length > 0 ? (
                        type.moderators.map(mod => (
                          <CommandItem
                            key={mod.value}
                            value={mod.value}
                            onSelect={() => {
                              handleSelectModerator(mod.value);
                              setIsOpen(false); // Close drawer on selection
                            }}
                            className="cursor-pointer p-2 hover:bg-gray-200 rounded gap-3"
                          >
                            {mod.label}
                          </CommandItem>
                        ))
                      ) : (
                        <CommandEmpty>No items found.</CommandEmpty>
                      )}
                    </div>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </DrawerContent>
        </Drawer>
      ) : (
        // Dropdown for desktop
        <div className="hidden sm:block">
          <Button
            variant="outline"
            className="w-full sm:w-[200px] justify-start"
            onClick={() => setIsOpen(!isOpen)}
          >
            {triggerButtonText}
          </Button>

          {isOpen && (
            <div className="absolute z-10 w-full sm:w-[300px] bg-white border rounded shadow-md mt-2">
              <Command>
                <CommandInput placeholder="Search moderator..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {groupedModerators.map(type => (
                      <div key={type.value} className="py-2 px-4">
                        <h3 className="font-bold text-xs mb-2">{type.label}</h3>
                        {type.moderators.length > 0 ? (
                          type.moderators.map(mod => (
                            <CommandItem
                              key={mod.value}
                              value={mod.value}
                              onSelect={() => handleSelectModerator(mod.value)}
                              className="cursor-pointer p-2 hover:bg-gray-200 rounded gap-3"
                            >
                              {mod.label}
                            </CommandItem>
                          ))
                        ) : (
                          <CommandEmpty>No items found.</CommandEmpty>
                        )}
                      </div>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
