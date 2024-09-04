import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"; // Import the Sheet components
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer"; // Import Drawer components
import { Menu } from "lucide-react"; // Use Lucide's Menu icon
import { useNavigate } from "react-router-dom";
import { ReportCounter } from "@/components/elements/report-counter";
import { ComboBoxResponsive } from "@/components/elements/combo";
import { Helmet, HelmetProvider } from "react-helmet-async";
import ReportForm from "@/components/report-form";
function ReportScreen() {
  const navigate = useNavigate();
  const [isNavbarSheetOpen, setNavbarSheetOpen] = useState(false); // State to control the Navbar Sheet
  const [isReportSheetOpen, setReportSheetOpen] = useState(false); // State to control the Report Sheet
  const [accountSelected, setAccountSelected] = useState(false); // State for account selection
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640); // Track screen size

  // Track screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleContactClick = () => {
    navigate("/contact-us");
  };

  const handleFileReportClick = () => {
    if (accountSelected) {
      setReportSheetOpen(true);
    }
  };

  // Use callback to ensure up-to-date state
  const handleAccountSelect = useCallback(() => {
    console.log("Account selected");
    setAccountSelected(true);
  }, []);

  return (
    <HelmetProvider>
      <div className="flex flex-col min-h-screen">
        <Helmet>
          <title>{"InfraSee | Make a Report"}</title>
        </Helmet>
        <header className="w-full h-fit p-3 flex items-center justify-between border-b border-slate-400">
          <div
            className="w-[6rem] mt-1 cursor-pointer"
            onClick={handleLogoClick}
          >
            <img src="/infrasee_black.png" alt="Infrasee Logomark" />
          </div>
          <nav className="hidden sm:flex">
            <Button onClick={handleContactClick} variant="ghost">
              Contact Us
            </Button>
          </nav>

          {/* Mobile navbar sheet trigger */}
          <div className="sm:hidden">
            <Sheet open={isNavbarSheetOpen} onOpenChange={setNavbarSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setNavbarSheetOpen(true)}
                >
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
              <div className="rounded-md flex flex-col items-start justify-start gap-3">
                <div className="">
                  <h1 className="text-lg font-bold mb-2">
                    Who is your report for?
                  </h1>
                  <p className="text-sm text-gray-500">
                    Select an appropriate moderator based on the type of
                    infrastructure.
                  </p>
                </div>
                <div className="flex gap-2 w-full flex-row sm:flex-col mb-2">
                  <ComboBoxResponsive onSelect={handleAccountSelect} />
                  <Button
                    className="w-full h-auto"
                    disabled={!accountSelected}
                    onClick={handleFileReportClick}
                  >
                    File a Report
                  </Button>
                </div>
              </div>
            </div>

            {/* Inner 2 div */}
            <div className="border rounded-md flex-1 sm:h-80vh mt-1">
              <div className="h-full flex items-center justify-center">
                map here
              </div>
            </div>
          </div>

          {/* Second div */}
          <div className="flex-none">
            <ReportCounter
              total_reps={0}
              inprog_reps={0}
              resolved_reps={0}
              dismissed_reps={0}
            ></ReportCounter>
          </div>
        </main>

        {/* Reporting Drawer */}
        {isMobile ? (
          <Drawer open={isReportSheetOpen} onOpenChange={setReportSheetOpen}>
            <DrawerTrigger asChild>
              <Button className="hidden">Open Report Drawer</Button>
            </DrawerTrigger>
            <DrawerContent side="bottom">
              <DrawerHeader>
                <DrawerTitle>Report Form</DrawerTitle>
                <DrawerClose onClick={() => setReportSheetOpen(false)} />
              </DrawerHeader>
              <div className="p-4">
                {/* API call to get value to pass to selectedAccount prop */}
                {/* Display account-specific form using a component, accept selectedAccount as prop */}
                <ReportForm />
              </div>
            </DrawerContent>
          </Drawer>
        ) : (
          <Sheet
            open={isReportSheetOpen}
            onOpenChange={setReportSheetOpen}
            className="hidden sm:block"
          >
            <SheetTrigger asChild>
              <Button className="hidden">Open Report Sheet</Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Selected Moderator name here</SheetTitle>
                <SheetDescription>
                  Fill up the form below. Click submit when you're done.
                </SheetDescription>
              </SheetHeader>
              <div className="p-1">
                {/* API call to get value to pass to selectedAccount prop */}
                {/* Display account-specific form using a component, accept selectedAccount as prop */}
                <ReportForm />
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </HelmetProvider>
  );
}

export default ReportScreen;
