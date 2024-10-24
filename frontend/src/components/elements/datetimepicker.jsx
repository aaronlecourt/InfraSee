"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function DateTimePicker() {
  const [date, setDate] = React.useState();
  const [isOpen, setIsOpen] = React.useState(false);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const handleDateSelect = (selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (type, value) => {
    const newDate = date ? new Date(date) : new Date(); // Use current date if no date is set

    if (type === "hour") {
      newDate.setHours((parseInt(value) % 12) + (newDate.getHours() >= 12 ? 12 : 0));
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value));
    } else if (type === "ampm") {
      const currentHours = newDate.getHours();
      newDate.setHours(value === "PM" ? currentHours + 12 : currentHours - 12);
    }

    setDate(newDate);
  };

  // Add a passive wheel event listener for smoother scrolling
  React.useEffect(() => {
    const scrollAreas = document.querySelectorAll(".scroll-area");

    const handleWheel = (event) => {
      // Custom handling if needed
    };

    scrollAreas.forEach((area) => {
      area.addEventListener("wheel", handleWheel, { passive: true });
    });

    return () => {
      scrollAreas.forEach((area) => {
        area.removeEventListener("wheel", handleWheel);
      });
    };
  }, []);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal="true">
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "MMM dd yyyy hh:mmaa") : <span>Select date and time resolved</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 max-h-80 overflow-y-auto">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
          
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="scroll-area w-72 sm:w-auto overflow-auto">
              <div className="flex sm:flex-col p-2 pointer-events-auto">
                {hours.reverse().map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={date && date.getHours() % 12 === hour % 12 ? "default" : "ghost"}
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="scroll-area w-72 sm:w-auto overflow-auto">
              <div className="flex sm:flex-col p-2 pointer-events-auto">
                {minutes.map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={date && date.getMinutes() === minute ? "default" : "ghost"}
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("minute", minute.toString().padStart(2, '0'))} // Ensure two-digit format
                  >
                    {minute.toString().padStart(2, '0')}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="scroll-area overflow-auto">
              <div className="flex sm:flex-col p-2 pointer-events-auto">
                {["AM", "PM"].map((ampm) => (
                  <Button
                    key={ampm}
                    size="icon"
                    variant={
                      date &&
                      ((ampm === "AM" && date.getHours() < 12) ||
                      (ampm === "PM" && date.getHours() >= 12))
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("ampm", ampm)}
                  >
                    {ampm}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
