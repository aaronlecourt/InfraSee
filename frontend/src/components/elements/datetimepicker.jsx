import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function DateTimePicker({ value, onChange, minDate, maxDate }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [date, setDate] = React.useState(value ? new Date(value) : undefined);
  const [ampm, setAmpm] = React.useState("AM"); // AM/PM value

  const hours = Array.from({ length: 12 }, (_, i) => i + 1); // Hour options 1-12
  const minutes = Array.from({ length: 60 }, (_, i) => i); // Minute options 0-59

  // Update AM/PM based on the selected date
  const updateAmpmFromDate = (selectedDate) => {
    if (selectedDate) {
      const hour = selectedDate.getHours();
      setAmpm(hour < 12 ? "AM" : "PM");
    }
  };

  // Update AM/PM when the hour or minute is changed
  const updateAmpmFromTime = (newDate) => {
    const hour = newDate.getHours();
    setAmpm(hour < 12 ? "AM" : "PM");
  };

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
      
      // Update AM/PM after date select
      updateAmpmFromDate(newDate);
    }
  };

  // Function to handle changing the time
  const handleTimeChange = (type, value) => {
    const newDate = date ? new Date(date) : new Date();

    if (type === "hour") {
      let newHour = parseInt(value) % 12; // Keep hours between 1-12

      // Convert PM hours to 24-hour format
      if (ampm === "PM" && newHour !== 12) {
        newHour += 12; // Convert PM hours to 24-hour format
      }
      if (ampm === "AM" && newHour === 12) {
        newHour = 0; // Convert 12 AM to 0 hours (midnight)
      }

      newDate.setHours(newHour);
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value));
    } else if (type === "ampm") {
      setAmpm(value); // Update AM/PM state
      let currentHour = newDate.getHours();
      if (value === "PM" && currentHour < 12) {
        newDate.setHours(currentHour + 12); // Convert to PM
      } else if (value === "AM" && currentHour >= 12) {
        newDate.setHours(currentHour - 12); // Convert to AM
      }
    }

    // Ensure the selected time is within the bounds of minDate and maxDate
    if (minDate && newDate < new Date(minDate)) {
      const minSelectableTime = new Date(minDate);
      newDate.setHours(minSelectableTime.getHours());
      newDate.setMinutes(minSelectableTime.getMinutes());
    }

    if (maxDate && newDate > new Date(maxDate)) {
      return; // Don't allow selecting times beyond maxDate
    }

    setDate(newDate);
    onChange(newDate.toISOString());

    // Update AM/PM after time change
    updateAmpmFromTime(newDate);
  };

  // Dynamically return valid hour choices based on AM/PM selection and min/max time
  const getValidHours = () => {
    const validHours = [];
    const isSameDayMin = date && minDate && new Date(date).toDateString() === new Date(minDate).toDateString();
    const isSameDayMax = date && maxDate && new Date(date).toDateString() === new Date(maxDate).toDateString();

    const minHour = minDate ? new Date(minDate).getHours() : 0;
    const maxHour = maxDate ? new Date(maxDate).getHours() : 23;

    if (ampm === "AM") {
      // For AM, valid hours are 12 (midnight) to 11 AM
      for (let i = 12; i <= 12; i++) { // 12 AM
        validHours.push(i);
      }
      for (let i = 1; i <= 11; i++) { // 1 AM to 11 AM
        validHours.push(i);
      }
    } else {
      // For PM, valid hours are 12 (noon) to 11 PM
      for (let i = 12; i <= 12; i++) { // 12 PM
        validHours.push(i);
      }
      for (let i = 1; i <= 11; i++) { // 1 PM to 11 PM
        validHours.push(i);
      }
    }
    return validHours;
  };

  // Dynamically return valid minutes based on the selected hour and min/max time
  const getValidMinutes = (hour) => {
    const validMinutes = [];
    const minDateObj = minDate ? new Date(minDate) : null;
    const maxDateObj = maxDate ? new Date(maxDate) : null;
  
    const isSameDayMin = minDateObj && new Date(date).toDateString() === minDateObj.toDateString();
    const isSameDayMax = maxDateObj && new Date(date).toDateString() === maxDateObj.toDateString();
  
    const minMinute = minDateObj ? minDateObj.getMinutes() : 0;
    const maxMinute = maxDateObj ? maxDateObj.getMinutes() : 59;
  
    if (ampm === "AM") {
      for (let i = 0; i < 60; i++) {
        if (isSameDayMin && hour === minDateObj.getHours() && i < minMinute) continue;
        if (isSameDayMax && hour === maxDateObj.getHours() && i > maxMinute) continue;
        validMinutes.push(i);
      }
    } else {
      // Handle PM hours differently
      for (let i = 0; i < 60; i++) {
        if (hour === 12) {
          // Treat 12 PM as 12:00 to 12:59
          if (isSameDayMin && hour === minDateObj.getHours() && i < minMinute) continue;
          if (isSameDayMax && hour === maxDateObj.getHours() && i > maxMinute) continue;
          validMinutes.push(i);
        } else {
          // Convert PM hour to 24-hour format
          const pmHour = hour + 12;
  
          if (isSameDayMin && pmHour === minDateObj.getHours() && i < minMinute) continue;
          if (isSameDayMax && pmHour === maxDateObj.getHours()) {
            // Ensure that if we're at 5pm, we can only select up to minute 13
            if (i > maxMinute) continue; // Don't allow minutes greater than maxMinute
          }
          validMinutes.push(i);
        }
      }
    }
  
    return validMinutes;
  };
  
  // Function to filter minutes based on the selected hour
  const getFilteredMinutes = (hour) => {
    const validMinutes = getValidMinutes(hour);
    return validMinutes;
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
          {/* Only show time picker if a date has been selected */}
          {date && (
            <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
              <ScrollArea className="scroll-area w-72 sm:w-auto overflow-auto">
                <div className="flex sm:flex-col p-2 pointer-events-auto">
                  {getValidHours().map((hour) => (
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
                  {getFilteredMinutes(date ? date.getHours() : 0).map((minute) => (
                    <Button
                      key={minute}
                      size="icon"
                      variant={date && date.getMinutes() === minute ? "default" : "ghost"}
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() => handleTimeChange("minute", minute.toString())}
                    >
                      {minute < 10 ? `0${minute}` : minute}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>
              {/* AM/PM selection */}
              <div className="flex sm:flex-col p-2">
                <Button
                  size="icon"
                  variant={ampm === "AM" ? "default" : "ghost"}
                  onClick={() => handleTimeChange("ampm", "AM")}
                >
                  AM
                </Button>
                <Button
                  size="icon"
                  variant={ampm === "PM" ? "default" : "ghost"}
                  onClick={() => handleTimeChange("ampm", "PM")}
                >
                  PM
                </Button>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
