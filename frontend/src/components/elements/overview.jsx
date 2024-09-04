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

export function Overview({ goToReportsTab }) {
  return (
    <>
      <ReportCounter
        total_reps={0}
        inprog_reps={0}
        resolved_reps={0}
        dismissed_reps={0}
      />
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 h-auto">
        <div className="border rounded-md col-span-1 sm:col-span-2 min-h-[20rem]">map here</div>
        <div className="col-span-1 sm:col-span-1">
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
              <Button
                variant="link"
                className="w-full text-gray-500 flex gap-1"
                onClick={goToReportsTab} // Trigger tab change
              >
                <p className="text-xs font-medium">See all reports</p>
                <ChevronDown size={15} />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
