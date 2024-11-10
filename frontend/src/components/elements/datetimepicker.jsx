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

export function DateTimePicker({ value, onChange, minDate, maxDate }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [date, setDate] = React.useState(value ? new Date(value) : undefined);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const handleDateSelect = (selectedDate) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
  
      // Prevent selecting a date beyond maxDate
      if (maxDate && newDate > new Date(maxDate)) {
        return;
      }
  
      // Set default time based on minDate if available
      if (minDate) {
        const minSelectableTime = new Date(minDate);
        const isSameDay = newDate.toDateString() === minSelectableTime.toDateString();
        
        if (isSameDay) {
          newDate.setHours(minSelectableTime.getHours());
          newDate.setMinutes(minSelectableTime.getMinutes());
        } else {
          newDate.setHours(0);
          newDate.setMinutes(0);
        }
      } else {
        newDate.setHours(0);
        newDate.setMinutes(0);
      }
  
      setDate(newDate);
      onChange(newDate.toISOString());
    }
  };
  

  const handleTimeChange = (type, value) => {
    const newDate = date ? new Date(date) : new Date();

    if (type === "hour") {
      newDate.setHours((parseInt(value) % 12) + (newDate.getHours() >= 12 ? 12 : 0));
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value));
    } else if (type === "ampm") {
      const currentHours = newDate.getHours();
      newDate.setHours(value === "PM" ? currentHours + 12 : currentHours - 12);
    }

    // Ensure the selected time is within the bounds of minDate and maxDate
    if (minDate && newDate < new Date(minDate)) {
      const minSelectableTime = new Date(minDate);
      newDate.setHours(minSelectableTime.getHours());
      newDate.setMinutes(minSelectableTime.getMinutes());
    }

    if (maxDate && newDate > new Date(maxDate)) {
      return;
    }

    setDate(newDate);
    onChange(newDate.toISOString());
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal="true">
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "MMM dd yyyy hh:mmaa") : <span>Select date and time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 max-h-80 overflow-y-auto">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            fromDate={minDate} // Disable past dates based on minDate
            toDate={maxDate} // Disable future dates based on maxDate
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="scroll-area w-72 sm:w-auto overflow-auto">
              <div className="flex sm:flex-col p-2 pointer-events-auto">
                {hours.reverse().map((hour) => {
                  const isMinDate = date && date.toDateString() === new Date(minDate).toDateString();
                  const minHour = new Date(minDate).getHours() % 12 || 12;

                  return (
                    <Button
                      key={hour}
                      size="icon"
                      variant={date && date.getHours() % 12 === hour % 12 ? "default" : "ghost"}
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() => handleTimeChange("hour", hour.toString())}
                      disabled={
                        (isMinDate && hour <= minHour) ||
                        (maxDate && date && date.toDateString() === new Date(maxDate).toDateString() && hour > new Date(maxDate).getHours() % 12)
                      }
                    >
                      {hour}
                    </Button>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="scroll-area w-72 sm:w-auto overflow-auto">
              <div className="flex sm:flex-col p-2 pointer-events-auto">
                {minutes.map((minute) => {
                  const isMinDate = date && date.toDateString() === new Date(minDate).toDateString();
                  const minHour = new Date(minDate).getHours();

                  return (
                    <Button
                      key={minute}
                      size="icon"
                      variant={date && date.getMinutes() === minute ? "default" : "ghost"}
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() => handleTimeChange("minute", minute.toString().padStart(2, '0'))}
                      disabled={
                        (isMinDate && date.getHours() === minHour && minute < new Date(minDate).getMinutes()) ||
                        (maxDate && date && date.toDateString() === new Date(maxDate).toDateString() && minute > new Date(maxDate).getMinutes())
                      }
                    >
                      {minute.toString().padStart(2, '0')}
                    </Button>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="scroll-area overflow-auto">
              <div className="flex sm:flex-col p-2 pointer-events-auto">
                {["AM", "PM"].map((ampm) => {
                  const isMinDate = date && date.toDateString() === new Date(minDate).toDateString();
                  const minHour = new Date(minDate).getHours();
                  const isDisabled = isMinDate && (ampm === "AM" ? minHour >= 12 : minHour < 12);

                  return (
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
                      disabled={isDisabled}
                    >
                      {ampm}
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
