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

export function Overview({
  goToUnassignedTab,
  data,
  userInfo,
  unassigned,
  activeTab,
  highlightedId,
  setHighlightedId,
}) {
  const loggedModerator_id = userInfo._id;

  return (
    <div className="h-full flex flex-col">
      <ReportCounter data={data} userInfo={userInfo} activeTab={activeTab} />
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 h-full">
        <div className="border rounded-md col-span-1 sm:col-span-2 min-h-[30rem]">
          <Maps
            userInfo={loggedModerator_id}
            data={data}
            className="absolute inset-0 z-0"
          />
        </div>
        <div className="col-span-1 sm:col-span-1">
          <Card className="flex flex-col h-full min-h-[30rem]">
            <CardHeader className="flex-none">
              <CardTitle className="text-base font-bold leading-none">
                Unassigned Reports
              </CardTitle>
              <CardDescription className="text-xs font-normal text-gray-500 leading-none">
                Below are some reports that are still up for grabs.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 w-full overflow-hidden">
              <ScrollArea className="h-full px-5">
                <ReportList
                  data={unassigned}
                  setHighlightedId={setHighlightedId}
                  goToUnassignedTab={goToUnassignedTab}
                />
              </ScrollArea>
            </CardContent>

            <CardFooter className="flex-none">
              <Button
                variant="link"
                className="w-full text-gray-500 flex gap-1"
                onClick={goToUnassignedTab}
              >
                <p className="text-xs font-medium">
                  See all unassigned reports
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
