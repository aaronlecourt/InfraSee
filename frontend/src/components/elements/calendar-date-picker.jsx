import React, { useState, forwardRef } from "react";
import { CalendarIcon } from "lucide-react";
import {
  startOfWeek,
  endOfWeek,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  startOfDay,
  endOfDay,
  format,
} from "date-fns";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "../ui/calendar";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const multiSelectVariants = cva(
  "flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium text-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground text-background",
        link: "underline-offset-4 hover:underline text-background",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const CalendarDatePicker = forwardRef(
  (
    {
      id = "calendar-date-picker",
      className,
      size = "filter",
      date,
      closeOnSelect = false,
      numberOfMonths = 2,
      yearsRange = 10,
      onDateSelect,
      variant,
      ...props
    },
    ref
  ) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [selectedRange, setSelectedRange] = useState(
      numberOfMonths === 2 ? "This Year" : "Today"
    );
    const [monthFrom, setMonthFrom] = useState(date?.from);
    const [yearFrom, setYearFrom] = useState(date?.from?.getFullYear());
    const [monthTo, setMonthTo] = useState(
      numberOfMonths === 2 ? date?.to : date?.from
    );
    const [yearTo, setYearTo] = useState(
      numberOfMonths === 2 ? date?.to?.getFullYear() : date?.from?.getFullYear()
    );
    const [highlightedPart, setHighlightedPart] = useState(null);

    const handleClose = () => setIsPopoverOpen(false);

    const handleTogglePopover = () => setIsPopoverOpen((prev) => !prev);

    const selectDateRange = (from, to, range) => {
      const startDate = startOfDay(from);
      const endDate = numberOfMonths === 2 ? endOfDay(to) : startDate;
      onDateSelect({ from: startDate, to: endDate });
      setSelectedRange(range);
      setMonthFrom(from);
      setYearFrom(from.getFullYear());
      setMonthTo(to);
      setYearTo(to.getFullYear());
      closeOnSelect && setIsPopoverOpen(false);
    };

    const handleDateSelect = (range) => {
      if (range) {
        let from = startOfDay(range.from);
        let to = range.to ? endOfDay(range.to) : from;
        if (numberOfMonths === 1) {
          if (range.from !== date.from) {
            to = from;
          } else {
            from = startOfDay(range.to);
          }
        }
        onDateSelect({ from, to });
        setMonthFrom(from);
        setYearFrom(from.getFullYear());
        setMonthTo(to);
        setYearTo(to.getFullYear());
      }
      setSelectedRange(null);
    };

    const handleMonthChange = (newMonthIndex, part) => {
      setSelectedRange(null);
      if (part === "from") {
        if (yearFrom !== undefined) {
          if (newMonthIndex < 0 || newMonthIndex > months.length - 1) return;
          const newMonth = new Date(yearFrom, newMonthIndex, 1);
          const from =
            numberOfMonths === 2
              ? startOfMonth(newMonth)
              : date?.from
              ? new Date(
                  date.from.getFullYear(),
                  newMonth.getMonth(),
                  date.from.getDate()
                )
              : newMonth;
          const to =
            numberOfMonths === 2
              ? date.to
                ? endOfDay(date.to)
                : endOfMonth(newMonth)
              : from;
          if (from <= to) {
            onDateSelect({ from, to });
            setMonthFrom(newMonth);
            setMonthTo(date.to);
          }
        }
      } else {
        if (yearTo !== undefined) {
          if (newMonthIndex < 0 || newMonthIndex > months.length - 1) return;
          const newMonth = new Date(yearTo, newMonthIndex, 1);
          const from = date.from
            ? startOfDay(date.from)
            : startOfMonth(newMonth);
          const to = numberOfMonths === 2 ? endOfMonth(newMonth) : from;
          if (from <= to) {
            onDateSelect({ from, to });
            setMonthTo(newMonth);
            setMonthFrom(date.from);
          }
        }
      }
    };

    const handleYearChange = (newYear, part) => {
      setSelectedRange(null);
      if (part === "from") {
        if (years.includes(newYear)) {
          const newMonth = monthFrom
            ? new Date(newYear, monthFrom ? monthFrom.getMonth() : 0, 1)
            : new Date(newYear, 0, 1);
          const from =
            numberOfMonths === 2
              ? startOfMonth(newMonth)
              : date.from
              ? new Date(newYear, newMonth.getMonth(), date.from.getDate())
              : newMonth;
          const to =
            numberOfMonths === 2
              ? date.to
                ? endOfDay(date.to)
                : endOfMonth(newMonth)
              : from;
          if (from <= to) {
            onDateSelect({ from, to });
            setYearFrom(newYear);
            setMonthFrom(newMonth);
            setYearTo(date.to?.getFullYear());
            setMonthTo(date.to);
          }
        }
      } else {
        if (years.includes(newYear)) {
          const newMonth = monthTo
            ? new Date(newYear, monthTo.getMonth(), 1)
            : new Date(newYear, 0, 1);
          const from = date.from
            ? startOfDay(date.from)
            : startOfMonth(newMonth);
          const to = numberOfMonths === 2 ? endOfMonth(newMonth) : from;
          if (from <= to) {
            onDateSelect({ from, to });
            setYearTo(newYear);
            setMonthTo(newMonth);
            setYearFrom(date.from?.getFullYear());
            setMonthFrom(date.from);
          }
        }
      }
    };

    const today = new Date();

    const years = Array.from(
      { length: yearsRange + 1 },
      (_, i) => today.getFullYear() - Math.floor(yearsRange / 2) + i
    );

    const dateRanges = [
      { label: "Today", start: today, end: today },
      { label: "Yesterday", start: subDays(today, 1), end: subDays(today, 1) },
      {
        label: "This Week",
        start: startOfWeek(today, { weekStartsOn: 1 }),
        end: endOfWeek(today, { weekStartsOn: 1 }),
      },
      {
        label: "Last Week",
        start: subDays(startOfWeek(today, { weekStartsOn: 1 }), 7),
        end: subDays(endOfWeek(today, { weekStartsOn: 1 }), 7),
      },
      { label: "Last 7 Days", start: subDays(today, 6), end: today },
      {
        label: "This Month",
        start: startOfMonth(today),
        end: endOfMonth(today),
      },
      {
        label: "Last Month",
        start: startOfMonth(subDays(today, 30)),
        end: endOfMonth(subDays(today, 30)),
      },
      { label: "This Year", start: startOfYear(today), end: endOfYear(today) },
      {
        label: "Last Year",
        start: startOfYear(subDays(today, 365)),
        end: endOfYear(subDays(today, 365)),
      },
    ];

    return (
      <div className={cn("relative", className)} {...props} ref={ref}>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={variant}
              className={cn(
                multiSelectVariants({ variant }),
                "w-full justify-start"
              )}
              onClick={handleTogglePopover}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date
                ? `${format(date.from, "MMM dd, yyyy")} - ${format(
                    date.to,
                    "MMM dd, yyyy"
                  )}`
                : "Select Date"}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-full">
            <div className="flex gap-4">
              <div className="flex flex-col gap-2 pr-2 border-r">
                {dateRanges.map((range, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className={cn({
                      "bg-accent text-accent-foreground":
                        selectedRange === range.label,
                    })}
                    onClick={() =>
                      selectDateRange(range.start, range.end, range.label)
                    }
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                {numberOfMonths === 2 && (
                  <div className="flex gap-4">
                    <div className="flex-1 flex gap-4">
                      <Select
                        className="flex-1"
                        value={monthFrom?.getMonth()}
                        onValueChange={(val) =>
                          handleMonthChange(Number(val), "from")
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Month From" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month, index) => (
                            <SelectItem key={index} value={index}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        className="flex-1"
                        value={yearFrom}
                        onValueChange={(val) =>
                          handleYearChange(Number(val), "from")
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Year From" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1 flex gap-4">
                      <Select
                        className="flex-1"
                        value={monthTo?.getMonth()}
                        onValueChange={(val) =>
                          handleMonthChange(Number(val), "to")
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Month To" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month, index) => (
                            <SelectItem key={index} value={index}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        className="flex-1"
                        value={yearTo}
                        onValueChange={(val) =>
                          handleYearChange(Number(val), "to")
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Year To" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <Calendar
                  date={date}
                  onDateChange={handleDateSelect}
                  numberOfMonths={numberOfMonths}
                  highlightedPart={highlightedPart}
                  setHighlightedPart={setHighlightedPart}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

CalendarDatePicker.displayName = "CalendarDatePicker";

export { CalendarDatePicker };
