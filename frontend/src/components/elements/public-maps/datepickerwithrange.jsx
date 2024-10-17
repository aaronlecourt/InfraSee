import React, { useState } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import {
  addDays,
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subDays,
} from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DatePickerWithRange({ className, onDateSelect }) {
  const today = new Date();
  const [date, setDate] = useState({ from: today, to: today }); // Set default to today
  const [selectedRangeLabel, setSelectedRangeLabel] = useState("Today");

  const handleDateSelect = (range, label) => {
    if (range && range.from && range.to) {
      setDate(range);
      setSelectedRangeLabel(label);
      onDateSelect(range);
    }
  };

  const predefinedRanges = {
    "Today": { from: today, to: today },
    "Yesterday": { from: subDays(today, 1), to: subDays(today, 1) },
    "This Week": { from: startOfWeek(today, { weekStartsOn: 1 }), to: endOfWeek(today, { weekStartsOn: 1 }) },
    "Last Week": { from: subDays(startOfWeek(today, { weekStartsOn: 1 }), 7), to: subDays(endOfWeek(today, { weekStartsOn: 1 }), 7) },
    "This Month": { from: startOfMonth(today), to: endOfMonth(today) },
    "Last Month": { from: startOfMonth(subDays(today, 30)), to: endOfMonth(subDays(today, 30)) },
    "This Year": { from: startOfYear(today), to: endOfYear(today) },
    "Last Year": { from: startOfYear(subDays(today, 365)), to: endOfYear(subDays(today, 365)) },
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <>
                {format(today, "LLL dd, y")} - {format(today, "LLL dd, y")}
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col md:flex-row max-h-96 overflow-y-auto p-3 rounded-md w-auto " align="start">
          <div className="flex flex-col gap-2 mb-3 md:hidden">
            <Select onValueChange={(value) => handleDateSelect(predefinedRanges[value], value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a range" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Predefined Ranges</SelectLabel>
                  {Object.entries(predefinedRanges).map(([label, range]) => (
                    <SelectItem key={label} value={label}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="hidden md:flex flex-col gap-2 mb-3 sm:mr-3">
            {Object.entries(predefinedRanges).map(([label, range]) => (
              <Button
                key={label}
                variant={selectedRangeLabel === label ? "default" : "outline"}
                onClick={() => handleDateSelect(range, label)}
              >
                {label}
              </Button>
            ))}
          </div>
          <div className="flex md:border-l">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={today}
              selected={date}
              onSelect={(range) => {
                if (range.from && range.to) {
                  handleDateSelect(range, "Custom");
                }
              }}
              numberOfMonths={2}
              modifiers={{
                highlighted: {
                  days: [today],
                },
              }}
              modifiersClassNames={{
                highlighted: "bg-blue-500 text-white",
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
