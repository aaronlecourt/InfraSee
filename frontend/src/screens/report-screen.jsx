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
import { Menu, PenBoxIcon } from "lucide-react";  // Removed GlobeIcon
import { useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { ReportCounter } from "@/components/elements/report-counter";
import axios from "axios";
import PublicMaps from "@/components/elements/public-maps/publicmaps";
import MultiStepForm from "@/components/mobile-multistep-reportform/mobile-report-form";
import { DatePickerWithRange } from "@/components/elements/public-maps/datepickerwithrange";


const infraTypeIcons = {
  "Power and Energy": "/pins/power_energy.png",
  "Water and Waste": "/pins/water_waste.png",
  "Transportation": "/pins/transportation.png",
  "Telecommunications": "/pins/telecom.png",
  "Commercial": "/pins/commercial.png",
};

// Fetch infrastructure types from API
const fetchInfraTypes = async () => {
  const response = await axios.get("/api/infrastructure-types");
  return response.data; // Array of infrastructure types with { _id, infra_name }
};

// Fetch reports from the API
const fetchReports = async () => {
  const response = await axios.get("/api/reports/");
  return response.data;
};

function ReportScreen() {
  const navigate = useNavigate();
  const [isNavbarSheetOpen, setNavbarSheetOpen] = useState(false);
  const [isMultiStepFormOpen, setMultiStepFormOpen] = useState(false);
  const [showReportCounter, setShowReportCounter] = useState(false);
  const [selectedInfraType, setSelectedInfraType] = useState("All");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [data, setData] = useState([]);
  const [infraTypes, setInfraTypes] = useState([]); // State to store infrastructure types

  // Set default date range to today
  const today = new Date();
  const fromISO = new Date(today.setUTCHours(0, 0, 0, 0)).toISOString();
  const toISO = new Date(today.setUTCHours(23, 59, 59, 999)).toISOString();
  const [dateRange, setDateRange] = useState({ from: fromISO, to: toISO });

  // Fetch data for infraTypes and reports
  useEffect(() => {
    const loadInfraTypes = async () => {
      try {
        const infraTypesData = await fetchInfraTypes();
        setInfraTypes(infraTypesData);
      } catch (error) {
        console.error("Error fetching infrastructure types:", error);
      }
    };

    loadInfraTypes();
  }, []);

  useEffect(() => {
    socket.on("reportChange", loadReports);
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

  const handleInfraTypeChange = (infraTypeId) => {
    setSelectedInfraType(infraTypeId);
  };

  const handleDateRangeChange = (range) => {
    if (range && range.from && range.to) {
      const fromDate = new Date(range.from);
      const toDate = new Date(range.to);
      fromDate.setUTCHours(0, 0, 0, 0);
      toDate.setUTCHours(23, 59, 59, 999);
      const fromISO = fromDate.toISOString();
      const toISO = toDate.toISOString();
      setDateRange({ from: fromISO, to: toISO });
    } else {
      setDateRange({ from: null, to: null });
    }
  };

  const filteredData = data.filter(report => {
    const reportDate = new Date(report.createdAt);
    const normalizedReportDate = new Date(reportDate.setUTCHours(0, 0, 0, 0));

    const { from, to } = dateRange;
    const fromDate = from ? new Date(from).setUTCHours(0, 0, 0, 0) : null;
    const toDate = to ? new Date(to).setUTCHours(23, 59, 59, 999) : null;

    const isInDateRange =
      (fromDate === null || normalizedReportDate >= fromDate) &&
      (toDate === null || normalizedReportDate <= toDate);

    const isInfraTypeMatch =
      selectedInfraType === "All" ||
      report.infraType._id === selectedInfraType; // Match by ID

    return isInDateRange && isInfraTypeMatch;
  });

  // Check if a report exists for a given infraType
  const isInfraTypeEnabled = (infraTypeId) => {
    if (infraTypeId === "All") {
      return true; // "All" should always be enabled
    }
    return data.some((report) => report.infraType._id === infraTypeId);
  };

  return (
    <HelmetProvider>
      <div className="flex flex-col min-h-screen">
        <Helmet>
          <title>{"InfraSee | Make a Report"}</title>
        </Helmet>
        <div className="relative h-full">
          <PublicMaps data={filteredData} className="absolute inset-0 z-0" />
          <div className="absolute top-0 z-50 w-full h-fit p-3 flex items-center justify-between border-b border-muted-foreground bg-white">
            <div className="w-[6rem] mt-1 cursor-pointer" onClick={handleLogoClick}>
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
                  <Button variant="outline" size="icon" onClick={() => setNavbarSheetOpen(true)}>
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
            <div className="flex flex-col sm:flex-row gap-2 items-start">
              <Button variant="default" className="flex gap-x-2 sm:max-w-xs" onClick={handleOpenMultiStepForm}>
                <PenBoxIcon size={15} />
                <span className="font-medium">File Report</span>
              </Button>
              <DatePickerWithRange onDateSelect={handleDateRangeChange} />
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              {/* INFRA TYPE FILTERS */}
              {[{ _id: "All", infra_name: "All" }, ...infraTypes].map((infraType) => (
                <div key={infraType._id || "All"} className="relative">
                  {/* Show description on mobile */}
                  {isMobile && selectedInfraType === infraType._id && (
                    <div className="absolute left-0 -top-5 text-nowrap bg-white rounded-full border p-0.8 px-2 font-medium z-10 text-[0.7rem]">
                      {infraType.infra_name}
                    </div>
                  )}
                  <Button
                    className="h-8 flex items-center gap-x-2 sm:w-auto sm:p-3 p-0 w-8 rounded-full text-xs"
                    variant={selectedInfraType === infraType._id ? "default" : "outline"}
                    onClick={() => handleInfraTypeChange(infraType._id || "All")}
                    disabled={!isInfraTypeEnabled(infraType._id)}
                  >
                    {infraType._id === "All" ? (
                      <span>{infraType.infra_name}</span> // No icon for "All"
                    ) : (
                      <>
                        <img src={infraTypeIcons[infraType.infra_name]} alt={infraType.infra_name} className="h-4" />
                        <span className="sm:block hidden">{infraType.infra_name}</span>
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
          {isMultiStepFormOpen && (
            <MultiStepForm open={isMultiStepFormOpen} onClose={handleCloseMultiStepForm} />
          )}
        </div>
      </div>
    </HelmetProvider>
  );
}

export default ReportScreen;
