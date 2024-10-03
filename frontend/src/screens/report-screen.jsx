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
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ReportCounter } from "@/components/elements/report-counter";
import { ComboBoxResponsive } from "@/components/elements/combo";
import { Helmet, HelmetProvider } from "react-helmet-async";
import ReportForm from "@/components/report-form";
import axios from "axios";
import PublicMaps from "@/components/elements/publicmaps";
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
        </header>

        <main className="flex flex-col flex-1 p-4">
          <div className="flex flex-col flex-1 mb-3 sm:flex-row sm:space-x-4 sm:space-y-0">
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

            <div className="border rounded-md flex-1 mt-1">
              <div className="h-full">
                <PublicMaps data={data}/>
              </div>
            </div>
          </div>

          <div className="flex-none">
            <ReportCounter data={data} />
          </div>
        </main>

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
    </HelmetProvider>
  );
}

export default ReportScreen;
