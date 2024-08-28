import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"; // Import the Sheet components
import { Menu } from "lucide-react"; // Use Lucide's Menu icon
import { useNavigate } from "react-router-dom";

import { ComboBoxResponsive } from "@/components/elements/combo";

function ReportScreen() {
  const navigate = useNavigate();
  const [isSheetOpen, setSheetOpen] = useState(false); // State to control the Sheet

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleContactClick = () => {
    navigate("/contact-us");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full h-fit p-3 flex items-center justify-between border-b border-slate-400">
        <div className="w-[6rem] mt-1 cursor-pointer" onClick={handleLogoClick}>
          <img src="/infrasee_black.png" alt="Infrasee Logomark" />
        </div>
        <nav className="hidden sm:flex">
          <Button onClick={handleContactClick} variant="ghost">
            Contact Us
          </Button>
        </nav>

        {/* Mobile sheet trigger */}
        <div className="sm:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" /> {/* Lucide Menu Icon */}
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="top">
              <nav className="grid gap-4 py-1">
                <Button onClick={handleContactClick} variant="ghost">
                  Contact Us
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex flex-col flex-1 p-4">
        {/* Container for the two inner divs */}
        <div className="flex flex-col flex-1 mb-3 sm:flex-row sm:space-x-4 sm:space-y-0">
          {/* Inner 1 div */}
          <div className="sm:flex-none sm:w-1/4">
            <div className="rounded-md flex flex-col items-start justify-start p-3 gap-3">
              <div className="">
                <h1 className="text-lg mb-2">Who is your report for?</h1>
                <p className="text-sm text-gray-500">Select an appropriate moderator based on the type of infrastructure.</p>
              </div>
              <ComboBoxResponsive />
              <Button className="w-full">File a Report</Button>
            </div>
          </div>

          {/* Inner 2 div */}
          <div className="border rounded-md flex-1 sm:h-80vh">
            <div className="h-full flex items-center justify-center">map here</div>
          </div>
        </div>

        {/* Second div */}
        <div className="flex-none">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="border rounded-md p-3">
              <p className="text-sm">Total Reports</p>
              <h1 className="text-3xl">0</h1>
              <small className="text-xs font-normal">All reports made</small>
            </div>
            <div className="border rounded-md p-3">
              <p className="text-sm">In Progress Reports</p>
              <h1 className="text-3xl">0</h1>
              <small className="text-xs font-normal">Reports already being worked on</small>
            </div>
            <div className="border rounded-md p-3">
              <p className="text-sm">Resolved Reports</p>
              <h1 className="text-3xl">0</h1>
              <small className="text-xs font-normal">Finished or solved reports</small>
            </div>
            <div className="border rounded-md p-3">
              <p className="text-sm">Dismissed Reports</p>
              <h1 className="text-3xl">0</h1>
              <small className="text-xs font-normal">False or unreliable reports</small>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ReportScreen;
