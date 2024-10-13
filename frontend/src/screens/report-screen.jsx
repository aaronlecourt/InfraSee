import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { ReportCounter } from "@/components/elements/report-counter";
import axios from "axios";
import PublicMaps from "@/components/elements/publicmaps";
import MultiStepForm from "@/components/mobile-multistep-reportform/mobile-report-form"; // Import the MultiStepForm

function ReportScreen() {
  const navigate = useNavigate();
  const [isNavbarSheetOpen, setNavbarSheetOpen] = useState(false);
  const [isMultiStepFormOpen, setMultiStepFormOpen] = useState(false); // Manage MultiStepForm visibility
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchReports] = await Promise.all([axios.get("/api/reports")]);
        setData(fetchReports.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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

  const handleOpenMultiStepForm = () => {
    setMultiStepFormOpen(true); // Open the MultiStepForm
  };

  const handleCloseMultiStepForm = () => {
    setMultiStepFormOpen(false); // Close the MultiStepForm
  };

  return (
    <HelmetProvider>
      <div className="flex flex-col min-h-screen">
        <Helmet>
          <title>{"InfraSee | Make a Report"}</title>
        </Helmet>

        <div className="relative h-full">
          <PublicMaps data={data} className="absolute inset-0 z-0" />
          <div className="absolute top-0 z-50 w-full h-fit p-3 flex items-center justify-between border-b border-muted-foreground bg-white">
            <div
              className="w-[6rem] mt-1 cursor-pointer"
              onClick={handleLogoClick}
            >
              <img src="/infrasee-logo.svg" alt="Infrasee Logomark" />
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
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetHeader className="hidden">
                  <SheetTitle></SheetTitle>
                  <SheetDescription></SheetDescription>
                </SheetHeader>
                <SheetContent side="top">
                  <nav className="grid gap-4 py-1">
                    <Button onClick={handleContactClick} variant="ghost">
                      Contact Us
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="absolute z-50 top-56 left-5 right-5 rounded-lg max-w-xs bg-white p-3 border">
            <h1 className="text-base font-bold">Make a Report</h1>
            <p className="text-xs text-muted-foreground font-medium mb-3 leading-4">
              Click the button below to start your report.
            </p>
            <Button
              className="w-full h-auto"
              onClick={handleOpenMultiStepForm} // Open the MultiStepForm
            >
              Open Multi-Step Report Form
            </Button>
          </div>

          <div className="absolute z-50 bottom-5 left-5 right-5">
            <ReportCounter data={data} />
          </div>

          {/* MultiStepForm instance */}
          {isMultiStepFormOpen && (
            <MultiStepForm open={isMultiStepFormOpen} onClose={handleCloseMultiStepForm} />
          )}
        </div>
      </div>
    </HelmetProvider>
  );
}

export default ReportScreen;
