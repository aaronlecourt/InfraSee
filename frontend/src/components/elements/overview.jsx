// components/Overview.js
import React from "react";
import { ReportCounter } from "./report-counter";
import { ChevronDown } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Overview() {
  return (
    <>
      <ReportCounter
        total_reps={0}
        inprog_reps={0}
        resolved_reps={0}
        dismissed_reps={0}
      ></ReportCounter>
      <div className="mt-3 grid grid-cols-3 gap-3 h-auto">
        <div className="border rounded-md col-span-2">map here</div>
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold leading-none">
                Recent Reports
              </CardTitle>
              <CardDescription className="text-xs font-normal text-gray-500 leading-none">
                Below are some of your most recent reports.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] w-full p-1">
                {/* top 5 most recent reports here */}
                reports here
              </ScrollArea>
            </CardContent>
            <CardFooter>
            {/* link to reports tab */}
              <Button
                variant="link"
                className="w-full text-gray-500 flex gap-1"
              >
                <p className="text-xs font-medium">See all reports</p> 
                <ChevronDown size={15}></ChevronDown>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
