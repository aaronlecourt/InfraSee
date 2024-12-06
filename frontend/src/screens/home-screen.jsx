import React, { useEffect, useState, useRef } from "react"; // Import useRef
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  ArrowDown,
  Zap,
  Droplet,
  Car,
  Wifi,
  Building,
  ArrowRight,
} from "lucide-react";
import axios from "axios";

function HomeScreen() {
  const [reports, setReports] = useState([]);
  const [infraType, setInfraType] = useState([]);
  const [reportCounts, setReportCounts] = useState({
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });
  const navigate = useNavigate();
  const moreContentRef = useRef(null); // Create a ref for the "MORE CONTENT" section

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("/api/reports");
        setReports(response.data);

        const counts = response.data.reduce(
          (acc, report) => {
            if (report.report_status.stat_name === "Pending") acc.pending++;
            else if (report.report_status.stat_name === "In Progress") acc.inProgress++;
            else if (report.report_status.stat_name === "Resolved") acc.resolved++;
            return acc;
          },
          { pending: 0, inProgress: 0, resolved: 0 }
        );

        setReportCounts(counts);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    const fetchInfraTypes = async () => {
      try {
        const response = await axios.get("/api/infrastructure-types");
        setInfraType(response.data);
      } catch (error) {
        console.error("Error fetching infrastructure types:", error);
      }
    };

    fetchReports();
    fetchInfraTypes();
  }, []);

  const iconMapping = {
    "Power and Energy": <Zap size={20} className="text-muted-foreground" />,
    "Water and Waste": <Droplet size={20} className="text-muted-foreground" />,
    Transportation: <Car size={20} className="text-muted-foreground" />,
    Telecommunications: <Wifi size={20} className="text-muted-foreground" />,
    Commercial: <Building size={20} className="text-muted-foreground" />,
  };

  const descriptionMapping = {
    "Power and Energy":
      "For reports on broken power infrastructure—such as electrical posts, live wires, transformers, and more—service disconnections for non-payment are excluded.",
    "Water and Waste":
      "For reports on broken water or waste infrastructure, including pipes, canals, pumps, and more—service disconnections for non-payment are excluded.",
    Transportation:
      "For reports on broken transportation infrastructure—such as damaged roads, traffic signals, bridges, and more.",
    Telecommunications:
      "For reports on broken telecommunications infrastructure—such as downed cables, cell towers, and network outages—service disconnections for non-payment are excluded.",
    Commercial:
      "For reports on damaged or broken commercial infrastructure—such as retail spaces, parking lots, office buildings, and more.",
  };

  // Function to scroll to the "MORE CONTENT" section
  const scrollToMoreContent = () => {
    moreContentRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>{"InfraSee | Home"}</title>
      </Helmet>
      <header className="w-full h-fit p-3 flex items-center justify-between border-b border-slate-400 bg-white sticky top-0 z-20">
        <div
          className="w-[6rem] mt-1 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src="/infrasee_black.png" alt="Infrasee Logomark" />
        </div>
        <nav className="flex">
          <Button onClick={() => navigate("/contact-us")} variant="ghost">
            Contact Us
          </Button>
          <Button onClick={() => navigate("/report")}>Make a Report</Button>
        </nav>
      </header>

      <div className="relative">
        <img
          src="/bg-parallax.png"
          alt="Descriptive Alt Text"
          className="fixed bottom-0 left-0 w-full h-[80vh] md:h-[70vh] object-cover z-0"
        />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center py-20 px-4 bg-opacity-30">
          <div className="flex justify-center mb-4">
            <div className="flex gap-1 items-center text-xs font-normal">
              <span>Introducing Infrasee</span>
              <ArrowDown size={15} />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-center">
            A one-stop tool for reporting infrastructure damage.
          </h1>
          <p className="text-base text-muted-foreground mt-3 text-center max-w-lg">
            We provide a relatively easy way to report infrastructure issues,
            ensuring quick action and transparency in Baguio City.
          </p>
          <div className="flex gap-2 z-10 mt-5">
            <Button variant="outline" onClick={scrollToMoreContent} className="flex gap-2">
              Read More
              <ArrowDown size={15} />
            </Button>
            <Button variant="default" onClick={() => navigate("/faqs")}>
              Got Questions?
            </Button>
          </div>
        </div>
      </div>

      {/* MORE CONTENT */}
      <div ref={moreContentRef} className="pb-80 bg-black/5 flex flex-col items-center pt-6 px-5 sm:pt-12 justify-start rounded-t-full">
        <div className="pt-24 sm:pt-40 flex flex-col justify-center items-center gap-4 text-center">
          <div className="flex justify-evenly w-full">
            <div className="flex flex-col items-center">
              <div className="bg-white/70 border w-10 h-10 rounded-full flex items-center justify-center">
                <p className="text-base font-bold">{reportCounts.pending}</p>
              </div>
              <h3 className="text-xs font-semibold text-muted-foreground">Pending</h3>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-white/70 border w-10 h-10 rounded-full flex items-center justify-center">
                <p className="text-base font-bold">{reportCounts.inProgress}</p>
              </div>
              <h3 className="text-xs font-semibold text-muted-foreground">In Progress</h3>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-white/70 border w-10 h-10 rounded-full flex items-center justify-center">
                <p className="text-base font-bold">{reportCounts.resolved}</p>
              </div>
              <h3 className="text-xs font-semibold text-muted-foreground">Resolved</h3>
            </div>
          </div>
          <p className="max-w-md mt-5">
            With already over <b>{reports.length} reports</b> made. We continue
            to offer reporting services for the following infrastructure types.
          </p>

          <div className="flex max-w-3xl">
            <div className="flex flex-wrap items-start justify-center text-left gap-2">
              {infraType.map((infra) => (
                <div
                  key={infra._id}
                  className="flex flex-col flex-1 justify-start p-4 border rounded-lg cursor-pointer min-w-[250px] sm:mb-0 mb-2 text-wrap bg-white/70 min-h-[100px] sm:h-36"
                >
                  <div className="flex items-center gap-x-2">
                    <div>{iconMapping[infra.infra_name] || null}</div>
                    <Label className="font-bold text-base">{infra.infra_name}</Label>
                  </div>
                  <p className="text-xs text-muted-foreground font-normal mt-1">
                    {descriptionMapping[infra.infra_name] || "Description not available."}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="px-8 max-w-2xl mb-10">
            <p>
              Each report is valued and crucial to improving our service, and
              users will receive timely updates on the status and resolution of
              their reported issues.
            </p>
            <br />
            <p>If you have questions or want to learn more about InfraSee, go check out our 'Frequently Asked Questions' page</p>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
}

export default HomeScreen;
