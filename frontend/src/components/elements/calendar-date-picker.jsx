import React, { useState, forwardRef, useEffect } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import {
  format,
  startOfWeek,
  endOfWeek,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
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

const predefinedRanges = {
  "Today": {
    from: new Date(new Date().setHours(0, 0, 0, 0)),
    to: new Date(new Date().setHours(23, 59, 59, 999)),
  },
  "Yesterday": {
    from: new Date(new Date().setHours(0, 0, 0, 0) - 86400000),
    to: new Date(new Date().setHours(23, 59, 59, 999) - 86400000),
  },
  "This Week": {
    from: startOfWeek(new Date(), { weekStartsOn: 1 }),
    to: endOfWeek(new Date(), { weekStartsOn: 1 }),
  },
  "Last Week": {
    from: subDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 7),
    to: subDays(endOfWeek(new Date(), { weekStartsOn: 1 }), 7),
  },
  "This Month": {
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  },
  "Last Month": {
    from: startOfMonth(subDays(new Date(), 30)),
    to: endOfMonth(subDays(new Date(), 30)),
  },
  "This Year": {
    from: startOfYear(new Date()),
    to: endOfYear(new Date()),
  },
  "Last Year": {
    from: startOfYear(subDays(new Date(), 365)),
    to: endOfYear(subDays(new Date(), 365)),
  },
};

const CalendarDatePicker = forwardRef(({ className, onDateSelect, date, onReset }, ref) => {
  const today = new Date();
  const [selectedRangeLabel, setSelectedRangeLabel] = useState("");

  const handleDateSelect = (range, label) => {
    if (range && range.from && range.to) {
      onDateSelect(range);
      setSelectedRangeLabel(label);
    }
  };

  useEffect(() => {
    if (!date) {
      setSelectedRangeLabel("");
    }
  }, [date]);

  return (
    <div className={cn("grid gap-2", className)} ref={ref}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start text-left font-medium h-9">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date
              ? `${format(date.from, "MMM dd, yyyy")} - ${format(date.to, "MMM dd, yyyy")}`
              : "Select Date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col md:flex-row max-h-96 overflow-y-auto p-3 rounded-md w-auto" align="start">
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
          <div className="flex">
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
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
});

CalendarDatePicker.displayName = "CalendarDatePicker";

export { CalendarDatePicker };
