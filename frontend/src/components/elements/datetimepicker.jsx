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
import { toast } from "sonner";

export function DateTimePicker({ value, onChange, data }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [date, setDate] = React.useState(value ? new Date(value) : undefined);

  const createdAt = new Date(data.createdAt);
  const startAllowedTime = new Date(createdAt.getTime() + 60 * 60 * 1000); // 1 hour after creation
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999); // Set to today at 11:59:59.999 PM

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const handleDateSelect = (selectedDate) => {
    if (!selectedDate) return;

    if (
      selectedDate < startAllowedTime ||
      selectedDate > endDate
    ) {
      const formattedStart = format(startAllowedTime, "MMM dd yyyy hh:mma");
      const formattedEnd = format(endDate, "MMM dd yyyy hh:mma");
      toast.error(
        `The recommended selection range is between ${formattedStart} and ${formattedEnd}.`
      );
    }

    setDate(selectedDate);
    onChange(selectedDate.toISOString());
  };

  const handleTimeChange = (type, value) => {
    const newDate = date ? new Date(date) : new Date();

    if (type === "hour") {
      newDate.setHours(
        (parseInt(value) % 12) + (newDate.getHours() >= 12 ? 12 : 0)
      );
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value));
    } else if (type === "ampm") {
      const currentHours = newDate.getHours();
      if (value === "PM" && currentHours < 12) {
        newDate.setHours(currentHours + 12);
      } else if (value === "AM" && currentHours >= 12) {
        newDate.setHours(currentHours - 12);
      }
    }

    if (
      newDate < startAllowedTime ||
      newDate > endDate
    ) {
      const formattedStart = format(startAllowedTime, "MMM dd yyyy hh:mma");
      const formattedEnd = format(endDate, "MMM dd yyyy hh:mma");
      toast.error(
        `The recommended selection range is between ${formattedStart} and ${formattedEnd}.`
      );
    }

    setDate(newDate);
    onChange(newDate.toISOString());
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal="true">
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "MMM dd yyyy hh:mma")
          ) : (
            <span>Select date and time</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 max-h-80 overflow-y-auto">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            disabledDates={(d) => d < startAllowedTime || d > endDate} // Disable dates outside range
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="scroll-area w-72 sm:w-auto overflow-auto">
              <div className="flex sm:flex-col p-2 pointer-events-auto">
                {hours.reverse().map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={
                      date && date.getHours() % 12 === hour % 12
                        ? "default"
                        : "ghost"
                    }
                    disabled={ // Disable if selecting this hour would make the date invalid
                      new Date(date).setHours(hour) < startAllowedTime ||
                      new Date(date).setHours(hour) > endDate
                    }
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
                    variant={
                      date && date.getMinutes() === minute ? "default" : "ghost"
                    }
                    disabled={ // Disable if selecting this minute would make the date invalid
                      new Date(date).setMinutes(minute) < startAllowedTime ||
                      new Date(date).setMinutes(minute) > endDate
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() =>
                      handleTimeChange(
                        "minute",
                        minute.toString().padStart(2, "0")
                      )
                    }
                  >
                    {minute.toString().padStart(2, "0")}
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
                    disabled={ // Disable if setting AM/PM would make date invalid
                      (ampm === "AM" && date && date.getHours() >= 12 && date < startAllowedTime) ||
                      (ampm === "PM" && date && date.getHours() < 12 && date > endDate)
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
