import React, { useState, useCallback, useEffect } from "react";
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
import { ComboBoxResponsive } from "@/components/elements/combo";
import axios from "axios";
import PublicMaps from "@/components/elements/publicmaps";
import ReportForm from "@/components/report-form";
function ReportScreen() {
  const navigate = useNavigate();
  const [isNavbarSheetOpen, setNavbarSheetOpen] = useState(false);
  const [isReportSheetOpen, setReportSheetOpen] = useState(false);
  const [accountSelected, setAccountSelected] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
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

  const handleFileReportClick = () => {
    if (accountSelected) {
      setReportSheetOpen(true);
    }
  };

  const handleAccountSelect = useCallback((account) => {
    setSelectedAccount(account);
    setAccountSelected(true);
  }, []);

  const handleCloseReportForm = () => {
    setReportSheetOpen(false);
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
            <div className="">
              <div>
                <h1 className="text-base font-bold">
                  Who is your report for?
                </h1>
                <p className="text-xs text-muted-foreground font-medium mb-3 leading-4">
                  Select an appropriate moderator based on the type of
                  infrastructure.
                </p>
              </div>
              <div className="flex gap-2 w-full flex-row sm:flex-col">
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

          <div className="absolute z-50 bottom-5 left-5 right-5">
            <ReportCounter data={data} />
          </div>

          {/* Single instance of ReportForm */}
        {isReportSheetOpen && (
          <>
            {isMobile ? (
              <Drawer
                open={isReportSheetOpen}
                onOpenChange={handleCloseReportForm}
              >
                <DrawerTrigger asChild>
                  <Button className="hidden">Open Report Drawer</Button>
                </DrawerTrigger>
                <DrawerContent side="bottom">
                  <DrawerHeader>
                    <DrawerClose onClick={handleCloseReportForm} />
                    <DrawerTitle className="text-md font-bold leading-0">
                      {selectedAccount
                        ? selectedAccount.name
                        : "Select a Moderator"}
                    </DrawerTitle>
                    <DrawerDescription className="text-xs font-normal">
                      Fill up the form below. Click submit when you're done.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 pt-0">
                    <ReportForm selectedAccount={selectedAccount} />
                  </div>
                </DrawerContent>
              </Drawer>
            ) : (
              <Sheet
                open={isReportSheetOpen}
                onOpenChange={handleCloseReportForm}
                className="hidden sm:block"
              >
                <SheetTrigger asChild>
                  <Button className="hidden">Open Report Sheet</Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle className="text-md font-bold leading-0">
                      {selectedAccount
                        ? selectedAccount.name
                        : "Select a Moderator"}
                    </SheetTitle>
                    <SheetDescription className="text-xs font-normal">
                      Fill up the form below. Click submit when you're done.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="p-1">
                    <ReportForm selectedAccount={selectedAccount} />
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </>
        )}
        </div>
      </div>
    </HelmetProvider>
  );
}

export default ReportScreen;
