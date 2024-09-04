"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ComboBoxResponsive({ onSelect }) {
  const [infrastructureTypes, setInfrastructureTypes] = useState([]);
  const [moderatorsByType, setModeratorsByType] = useState({});
  const [selectedModerator, setSelectedModerator] = useState(null);

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
  };

  const selectedModeratorName = Object.values(moderatorsByType).flat().find((mod) => mod._id === selectedModerator)?.name;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {selectedModeratorName || "Select Infrastructure Type & Moderator"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {/* <DropdownMenuLabel>Select...</DropdownMenuLabel> */}
        <DropdownMenuGroup>
          {infrastructureTypes.map((infra) => (
            <DropdownMenuSub key={infra._id}>
              <DropdownMenuSubTrigger>
                {infra.infra_name}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {moderatorsByType[infra._id] && moderatorsByType[infra._id].length > 0 ? (
                  moderatorsByType[infra._id].map((mod) => (
                    <DropdownMenuItem
                      key={mod._id}
                      onClick={() => handleModeratorSelect(mod._id)}
                      className={`cursor-pointer ${selectedModerator === mod._id ? 'bg-primary text-white' : ''}`}
                    >
                      {mod.name}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>No moderators available</DropdownMenuItem>
                )}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
