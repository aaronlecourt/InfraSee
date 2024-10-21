"use client"

import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"

export function DateTimePicker({ value, onChange }) {
  const [date, setDate] = React.useState(value || new Date());
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDateSelect = selectedDate => {
    if (selectedDate) {
      setDate(selectedDate);
      onChange(selectedDate); // Call onChange to update parent state
    }
  }

  const handleTimeChange = (type, value) => {
    const currentDate = date || new Date();
    const newDate = new Date(currentDate);

    if (type === "hour") {
      newDate.setHours((parseInt(value) % 12) + (newDate.getHours() >= 12 ? 12 : 0));
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value));
    } else if (type === "ampm") {
      const currentHours = newDate.getHours();
      newDate.setHours(value === "PM" ? currentHours + 12 : currentHours - 12);
    }
    setDate(newDate);
    onChange(newDate); // Update the parent with new date
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "MMM dd yyyy - hh:mm aa") : <span>Jan 01 2024 - 01:00 PM</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="flex flex-col">
          <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
          <div className="flex flex-row gap-2 p-2">
            <div className="flex flex-col mb-4 w-full">
              <Select onValueChange={value => handleTimeChange("hour", value)}>
                <SelectTrigger className="border rounded p-1">
                  <span>{date ? String(date.getHours() % 12 || 12).padStart(2, '0') : "01"}</span>
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                      {String(i + 1).padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col mb-4 w-full">
              <Select onValueChange={value => handleTimeChange("minute", value)}>
                <SelectTrigger className="border rounded p-1">
                  <span>{date ? String(date.getMinutes()).padStart(2, '0') : "00"}</span>
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 60 }, (_, i) => (
                    <SelectItem key={i} value={String(i).padStart(2, '0')}>
                      {String(i).padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col mb-4 w-full">
              <Select onValueChange={value => handleTimeChange("ampm", value)}>
                <SelectTrigger className="border rounded p-1">
                  <span>{date && date.getHours() >= 12 ? "PM" : "AM"}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
