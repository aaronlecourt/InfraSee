import React, { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Spinner } from "@/components/ui/spinner";
import { RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Overview } from "@/components/elements/overview";
import { Archives } from "@/components/elements/archives";
import { Reports } from "@/components/elements/reports";
import Analytics from "@/components/elements/analytics";
import { Helmet, HelmetProvider } from "react-helmet-async";
import axios from "axios";
import { columnsModReports } from "@/components/data-table/columns/columnsModReports";
import { columnsModArchives } from "@/components/data-table/columns/columnsModArchives";
import { Button } from "@/components/ui/button";
import { SkeletonTable } from "@/components/elements/skeletontable";
import ModNavbar from "@/components/elements/mod-navbar/navbar";

const fetchReports = async () => {
  const response = await axios.get("/api/reports/moderator/reports");
  return response.data;
};

const fetchUnassigned = async () => {
  const response = await axios.get("/api/reports/unassigned");
  return response.data;
};
const fetchArchives = async () => {
  const response = await axios.get("/api/reports/moderator/archived/reports");
  return response.data;
};

const ModeratorDashboardScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("overview");
  const [reports, setReports] = useState([]);
  const [archives, setArchives] = useState([]);
  const [unassigned, setUnassigned] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingArchives, setLoadingArchives] = useState(true);
  const [loadingUnassigned, setLoadingUnassigned] = useState(true);

  // Fetch data
  const loadReports = async () => {
    setLoadingReports(true);
    try {
      const data = await fetchReports();
      setReports(data);
    } catch (error) {
      console.error("Failed to fetch reports", error);
    } finally {
      setLoadingReports(false);
    }
  };

  const loadUnassigned = async () => {
    setLoadingUnassigned(true);
    try {
      const data = await fetchUnassigned();
      setUnassigned(data);
    } catch (error) {
      console.error("Failed to fetch unassigned reports", error);
    } finally {
      setLoadingUnassigned(false);
    }
  };

  const loadArchives = async () => {
    setLoadingArchives(true);
    try {
      const data = await fetchArchives();
      setArchives(data);
    } catch (error) {
      console.error("Failed to fetch archives", error);
    } finally {
      setLoadingArchives(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadReports();
    loadArchives();
    loadUnassigned();
  }, []);

  const goToReportsTab = () => {
    setActiveTab("reports");
  };

  return (
    <HelmetProvider>
      <div>
        <Helmet>
          <title>{"InfraSee | Moderator Dashboard"}</title>
        </Helmet>
        <ModNavbar userInfo={userInfo} />
        <main className="p-4">
          <h1 className="text-3xl mb-1">Dashboard</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center gap-2">
              <TabsList className="h-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="archives">Archives</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              {/* Refresh Icon */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="filter"
                      onClick={() => {
                        loadReports();
                        loadArchives();
                      }}
                    >
                      <RefreshCcw size={15} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {/* Overview Tab */}
            <TabsContent value="overview" className="h-[calc(100vh-11rem)]">
              {loadingReports ? (
                <div className="flex justify-center items-center h-full">
                  <Spinner size="large" />
                </div>
              ) : (
                <Overview
                  goToReportsTab={goToReportsTab}
                  data={reports}
                  userInfo={userInfo}
                />
              )}
            </TabsContent>
            <TabsContent value="reports" className="h-[calc(100vh-11rem)]">
              {loadingReports ? (
                <SkeletonTable columns={columnsModReports} /> // Use the SkeletonTable here
              ) : (
                <Reports
                  data={reports}
                  columns={columnsModReports}
                  activeTab={activeTab}
                />
              )}
            </TabsContent>
            <TabsContent value="archives" className="h-[calc(100vh-11rem)]">
              {loadingArchives ? (
                <SkeletonTable columns={columnsModArchives} /> // Use the SkeletonTable here
              ) : (
                <Archives
                  data={archives}
                  columns={columnsModArchives}
                  activeTab={activeTab}
                />
              )}
            </TabsContent>
            {/* Analytics Tab */}
            <TabsContent value="analytics" className="h-[calc(100vh-11rem)]">
              <Analytics />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </HelmetProvider>
  );
};

export default ModeratorDashboardScreen;
