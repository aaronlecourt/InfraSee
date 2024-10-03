import React from "react";
import { ReportCounter } from "./report-counter";
import { ReportList } from "./report-list";
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
import Maps from "./maps";

export function Overview({ goToReportsTab, data, userInfo }) {
  const loggedModerator_id = userInfo._id
  return (
    <div className="h-full flex flex-col">
      <ReportCounter data={data} />
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 h-full">
        <div className="border rounded-md col-span-1 sm:col-span-2 min-h-[30rem]">
          <Maps userInfo={userInfo}/>
        </div>
        <div className="col-span-1 sm:col-span-1">
          <Card className="flex flex-col h-full min-h-[30rem]">
            <CardHeader className="flex-none">
              <CardTitle className="text-base font-bold leading-none">
                Recent Reports
              </CardTitle>
              <CardDescription className="text-xs font-normal text-gray-500 leading-none">
                Below are some of your most recent reports.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 w-full overflow-hidden">
              <ScrollArea className="h-full px-5">
                <ReportList data={data}/>
              </ScrollArea>
            </CardContent>

            <CardFooter className="flex-none">
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
    </div>
  );
}
