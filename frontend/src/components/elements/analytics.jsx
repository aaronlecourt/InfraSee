"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const description = "An interactive area chart";

const chartData = [
  { date: "2024-04-01", pending: 222, resolved: 150 },
  { date: "2024-04-02", pending: 97, resolved: 180 },
  { date: "2024-04-03", pending: 167, resolved: 120 },
  { date: "2024-04-04", pending: 242, resolved: 260 },
  { date: "2024-04-05", pending: 373, resolved: 290 },
  { date: "2024-04-06", pending: 301, resolved: 340 },
  { date: "2024-04-07", pending: 245, resolved: 180 },
  { date: "2024-04-08", pending: 409, resolved: 320 },
  { date: "2024-04-09", pending: 59, resolved: 110 },
  { date: "2024-04-10", pending: 261, resolved: 190 },
  { date: "2024-04-11", pending: 327, resolved: 350 },
  { date: "2024-04-12", pending: 292, resolved: 210 },
  { date: "2024-04-13", pending: 342, resolved: 380 },
  { date: "2024-04-14", pending: 137, resolved: 220 },
  { date: "2024-04-15", pending: 120, resolved: 170 },
  { date: "2024-04-16", pending: 138, resolved: 190 },
  { date: "2024-04-17", pending: 446, resolved: 360 },
  { date: "2024-04-18", pending: 364, resolved: 410 },
  { date: "2024-04-19", pending: 243, resolved: 180 },
  { date: "2024-04-20", pending: 89, resolved: 150 },
  { date: "2024-04-21", pending: 137, resolved: 200 },
  { date: "2024-04-22", pending: 224, resolved: 170 },
  { date: "2024-04-23", pending: 138, resolved: 230 },
  { date: "2024-04-24", pending: 387, resolved: 290 },
  { date: "2024-04-25", pending: 215, resolved: 250 },
  { date: "2024-04-26", pending: 75, resolved: 130 },
  { date: "2024-04-27", pending: 383, resolved: 420 },
  { date: "2024-04-28", pending: 122, resolved: 180 },
  { date: "2024-04-29", pending: 315, resolved: 240 },
  { date: "2024-04-30", pending: 454, resolved: 380 },
  { date: "2024-05-01", pending: 165, resolved: 220 },
  { date: "2024-05-02", pending: 293, resolved: 310 },
  { date: "2024-05-03", pending: 247, resolved: 190 },
  { date: "2024-05-04", pending: 385, resolved: 420 },
  { date: "2024-05-05", pending: 481, resolved: 390 },
  { date: "2024-05-06", pending: 498, resolved: 520 },
  { date: "2024-05-07", pending: 388, resolved: 300 },
  { date: "2024-05-08", pending: 149, resolved: 210 },
  { date: "2024-05-09", pending: 227, resolved: 180 },
  { date: "2024-05-10", pending: 293, resolved: 330 },
  { date: "2024-05-11", pending: 335, resolved: 270 },
  { date: "2024-05-12", pending: 197, resolved: 240 },
  { date: "2024-05-13", pending: 197, resolved: 160 },
  { date: "2024-05-14", pending: 448, resolved: 490 },
  { date: "2024-05-15", pending: 473, resolved: 380 },
  { date: "2024-05-16", pending: 338, resolved: 400 },
  { date: "2024-05-17", pending: 499, resolved: 420 },
  { date: "2024-05-18", pending: 315, resolved: 350 },
  { date: "2024-05-19", pending: 235, resolved: 180 },
  { date: "2024-05-20", pending: 177, resolved: 230 },
  { date: "2024-05-21", pending: 82, resolved: 140 },
  { date: "2024-05-22", pending: 81, resolved: 120 },
  { date: "2024-05-23", pending: 252, resolved: 290 },
  { date: "2024-05-24", pending: 294, resolved: 220 },
  { date: "2024-05-25", pending: 201, resolved: 250 },
  { date: "2024-05-26", pending: 213, resolved: 170 },
  { date: "2024-05-27", pending: 420, resolved: 460 },
  { date: "2024-05-28", pending: 233, resolved: 190 },
  { date: "2024-05-29", pending: 78, resolved: 130 },
  { date: "2024-05-30", pending: 340, resolved: 280 },
  { date: "2024-05-31", pending: 178, resolved: 230 },
  { date: "2024-06-01", pending: 178, resolved: 200 },
  { date: "2024-06-02", pending: 470, resolved: 410 },
  { date: "2024-06-03", pending: 103, resolved: 160 },
  { date: "2024-06-04", pending: 439, resolved: 380 },
  { date: "2024-06-05", pending: 88, resolved: 140 },
  { date: "2024-06-06", pending: 294, resolved: 250 },
  { date: "2024-06-07", pending: 323, resolved: 370 },
  { date: "2024-06-08", pending: 385, resolved: 320 },
  { date: "2024-06-09", pending: 438, resolved: 480 },
  { date: "2024-06-10", pending: 155, resolved: 200 },
  { date: "2024-06-11", pending: 92, resolved: 150 },
  { date: "2024-06-12", pending: 492, resolved: 420 },
  { date: "2024-06-13", pending: 81, resolved: 130 },
  { date: "2024-06-14", pending: 426, resolved: 380 },
  { date: "2024-06-15", pending: 307, resolved: 350 },
  { date: "2024-06-16", pending: 371, resolved: 310 },
  { date: "2024-06-17", pending: 475, resolved: 520 },
  { date: "2024-06-18", pending: 107, resolved: 170 },
  { date: "2024-06-19", pending: 341, resolved: 290 },
  { date: "2024-06-20", pending: 408, resolved: 450 },
  { date: "2024-06-21", pending: 169, resolved: 210 },
  { date: "2024-06-22", pending: 317, resolved: 270 },
  { date: "2024-06-23", pending: 480, resolved: 530 },
  { date: "2024-06-24", pending: 132, resolved: 180 },
  { date: "2024-06-25", pending: 141, resolved: 190 },
  { date: "2024-06-26", pending: 434, resolved: 380 },
  { date: "2024-06-27", pending: 448, resolved: 490 },
  { date: "2024-06-28", pending: 149, resolved: 200 },
  { date: "2024-06-29", pending: 103, resolved: 160 },
  { date: "2024-06-30", pending: 446, resolved: 400 },
];

const chartConfig = {
  reports: { label: "reports" },
  pending: { label: "pending", color: "hsl(var(--chart-1))" },
  resolved: { label: "resolved", color: "hsl(var(--chart-2))" },
};

export default function Analytics() {
  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const now = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") daysToSubtract = 30;
    else if (timeRange === "7d") daysToSubtract = 7;
    now.setDate(now.getDate() - daysToSubtract);
    return date >= now;
  });

  return (
    <Card className="border-0">
      <CardHeader className="items-center gap-2 space-y-0 py-5 sm:flex-row hidden">
        <div className="flex-1 gap-1 text-center sm:text-left hidden">
          <CardTitle>Area Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total reports for the last 3 months
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillpending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-pending)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-pending)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillresolved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-resolved)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-resolved)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent labelFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })} indicator="dot" />}
            />
            <Area dataKey="resolved" type="natural" fill="url(#fillresolved)" stroke="var(--color-resolved)" stackId="a" />
            <Area dataKey="pending" type="natural" fill="url(#fillpending)" stroke="var(--color-pending)" stackId="a" />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
