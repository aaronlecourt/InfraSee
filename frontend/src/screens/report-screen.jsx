import React, { useState, useEffect } from "react";
import socket from "@/utils/socket-connect";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Menu, ChevronUp, ChevronDown, PenBoxIcon } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { ReportCounter } from "@/components/elements/report-counter";
import axios from "axios";
import PublicMaps from "@/components/elements/public-maps/publicmaps";
import MultiStepForm from "@/components/mobile-multistep-reportform/mobile-report-form";

// Mapping of status to PNG paths
const statusIcons = {
  "Unassigned": "/pins/pins_-04.png",
  "In Progress": "/pins/pins_-02.png",
  "Resolved": "/pins/pins_-03.png",
  "Pending": "/pins/pins_-01.png",
  "Dismissed": "/pins/pins_-05.png",
  // No icon for "All"
};

const fetchReports = async () => {
  const response = await axios.get("/api/reports/");
  return response.data;
};

function ReportScreen() {
  const navigate = useNavigate();
  const [isNavbarSheetOpen, setNavbarSheetOpen] = useState(false);
  const [isMultiStepFormOpen, setMultiStepFormOpen] = useState(false);
  const [showReportCounter, setShowReportCounter] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [data, setData] = useState([]);

  useEffect(() => {
    socket.on("reportChange", () => {
      loadReports();
    });

    return () => {
      socket.off("reportChange");
    };
  }, []);

  const loadReports = async () => {
    try {
      const data = await fetchReports();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    loadReports();
  }, [isMultiStepFormOpen]);

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
    setMultiStepFormOpen(true);
  };

  const handleCloseMultiStepForm = () => {
    setMultiStepFormOpen(false);
  };

  const toggleReportCounter = () => {
    setShowReportCounter((prev) => !prev);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const filteredData = data.filter(report => {
    if (selectedStatus === "All") return true; 
    return report.report_status.stat_name === selectedStatus; 
  });

  return (
    <HelmetProvider>
      <div className="flex flex-col min-h-screen">
        <Helmet>
          <title>{"InfraSee | Make a Report"}</title>
        </Helmet>
        <div className="relative h-full">
          <PublicMaps data={filteredData} className="absolute inset-0 z-0" />
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

          <div className="absolute z-50 bottom-5 left-5 right-5 flex flex-col items-start gap-2">
            <div className="flex gap-2 items-center">
              <Button
                variant="default"
                className="flex gap-x-2 sm:max-w-xs"
                onClick={handleOpenMultiStepForm}
              >
                <PenBoxIcon size={15} />
                File Report
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              {["All", "Pending", "Resolved", "In Progress", "Dismissed", "Unassigned"].map(status => (
                <Button
                  key={status}
                  className="h-8 flex items-center gap-x-2 sm:w-auto sm:p-3 p-0 w-8 rounded-full text-xs"
                  variant={selectedStatus === status ? "default" : "outline"}
                  onClick={() => handleStatusChange(status)}
                >
                  {status !== "All" && (
                    <>
                      <img src={statusIcons[status]} alt={status} className="h-4" />
                      <span className="sm:block hidden">{status}</span>
                    </>
                  )}
                  {status === "All" && (
                    <span>{status}</span>
                  )}
                </Button>
              ))}
              <Button
                variant="default"
                onClick={toggleReportCounter}
                className="flex items-center justify-center w-5 h-5 p-0 rounded-full"
              >
                {!showReportCounter ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </Button>
            </div>
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                showReportCounter ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {showReportCounter && <ReportCounter data={data} />} {/* Pass all report data */}
            </div>
          </div>

          {isMultiStepFormOpen && (
            <MultiStepForm
              open={isMultiStepFormOpen}
              onClose={handleCloseMultiStepForm}
            />
          )}
        </div>
      </div>
    </HelmetProvider>
  );
}

export default ReportScreen;
