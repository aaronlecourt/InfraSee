import React, { useState } from "react";
import { ReportCounter } from "./report-counter";
import { ReportList } from "./report-list";
import { ChevronUp, ChevronDown } from "lucide-react";
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
import Maps from "./maps"; // Updated import to use the modified Maps component
import { SubReportCounter } from "./sub-report-counter";
import { SubReportList } from "./sub-report-list";

export function SubOverview({
  goToReportsTab,
  data,
  userInfo,
  activeTab,
  highlightedId,
  setHighlightedId,
}) {
  return (
    <div className="h-full flex flex-col">
      <SubReportCounter data={data} userInfo={userInfo} activeTab={activeTab} />
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 h-full">
        <div className="border rounded-md col-span-1 sm:col-span-2 min-h-[30rem]">
          <Maps
            userInfo={userInfo}
            data={data}
            className="absolute inset-0 z-0"
          />
        </div>
        <div className="col-span-1 sm:col-span-1">
          <Card className="flex flex-col h-full min-h-[30rem]">
            <CardHeader className="flex-none">
              <CardTitle className="text-base font-bold leading-none">
                Requested Reports
              </CardTitle>
              <CardDescription className="text-xs font-normal text-gray-500 leading-none">
                Below are some reports that are still up for reviewing.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 w-full overflow-hidden">
              <ScrollArea className="h-full px-5">
                <SubReportList
                  data={data}
                  setHighlightedId={setHighlightedId}
                  goToReportsTab={goToReportsTab}
                />
              </ScrollArea>
            </CardContent>

            <CardFooter className="flex-none">
              <Button
                variant="link"
                className="w-full text-gray-500 flex gap-1"
                onClick={goToReportsTab}
              >
                <p className="text-xs font-medium">
                  See all reports requested for review
                </p>
                <ChevronDown size={15} />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
