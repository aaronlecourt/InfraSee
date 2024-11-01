import React, { useState, useEffect } from "react";
import socket from "@/utils/socket-connect";
import { Spinner } from "@/components/ui/spinner";
import { useSelector } from "react-redux";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { Overview } from "@/components/elements/overview";
import { HiddenReports } from "@/components/elements/hidden-reports";
import { Unassigned } from "@/components/elements/unassigned";
import { Reports } from "@/components/elements/reports";

import { Helmet, HelmetProvider } from "react-helmet-async";
import axios from "axios";
import { columnsModReports } from "@/components/data-table/columns/columnsModReports";
import { columnsModHidden } from "@/components/data-table/columns/columnsModHidden";
import { SkeletonTable } from "@/components/elements/skeletontable";
import ModNavbar from "@/components/elements/mod-navbar/navbar";
import { columnsModUnassigned } from "@/components/data-table/columns/columnsModUnassigned";

const fetchReports = async () => {
  const response = await axios.get("/api/reports/moderator/reports");
  return response.data;
};

const fetchUnassigned = async () => {
  const response = await axios.get("/api/reports/unassigned");
  return response.data;
};

const fetchHidden = async () => {
  const response = await axios.get("/api/reports/moderator/hidden/reports");
  return response.data;
};

const ModeratorDashboardScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("overview");
  const [reports, setReports] = useState([]);
  const [unassigned, setUnassigned] = useState([]);
  const [hidden, setHidden] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingHidden, setLoadingHidden] = useState(true);
  const [loadingUnassigned, setLoadingUnassigned] = useState(true);
  const [highlightedId, setHighlightedId] = useState();
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);

  useEffect(() => {
    socket.on("reportChange", (change) => {
      console.log("Received report change:", change);
      loadReports();
      loadHidden();
      loadUnassigned();
    });

    return () => {
      socket.off("reportChange");
    };
  }, []);

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

  const loadHidden = async () => {
    setLoadingHidden(true);
    try {
      const data = await fetchHidden();
      setHidden(data);
    } catch (error) {
      console.error("Failed to fetch hidden", error);
    } finally {
      setLoadingHidden(false);
    }
  };

  console.log("UPDATED SELECT:", selectedNotificationId);
  // Initial load
  useEffect(() => {
    loadReports();
    loadUnassigned();
    loadHidden();
  }, []);

  const goToUnassignedTab = () => {
    setActiveTab("unassigned");
  };

  // Combine reports and unassigned reports for the Overview
  const combinedReports = [...reports, ...unassigned];

  return (
    <HelmetProvider>
      <div>
        <Helmet>
          <title>{"InfraSee | Moderator Dashboard"}</title>
        </Helmet>
        <div className="sticky top-0 z-10 bg-white">
          <ModNavbar
            userInfo={userInfo}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setSelectedNotificationId={setSelectedNotificationId}
          />
        </div>

        <main className="p-4">
          <h1 className="text-3xl">Dashboard</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center gap-2">
              <TabsList className="h-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="unassigned">Unassigned</TabsTrigger>
                <TabsTrigger value="hidden">Hidden</TabsTrigger>
              </TabsList>
            </div>

            {/* OVERVIEW */}
            <TabsContent value="overview" className="h-[calc(100vh-11rem)]">
              {loadingReports || loadingUnassigned ? (
                <div className="flex justify-center items-center h-full">
                  <Spinner size="large" />
                </div>
              ) : (
                <Overview
                  goToUnassignedTab={goToUnassignedTab}
                  data={combinedReports}
                  userInfo={userInfo}
                  unassigned={unassigned}
                  activeTab={activeTab}
                  setSelectedNotificationId={setSelectedNotificationId}
                />
              )}
            </TabsContent>

            {/* MODERATOR REPORTS 
                Shows reports that are GRABBED by the moderator
            */}
            <TabsContent value="reports" className="h-[calc(100vh-11rem)]">
              {loadingReports ? (
                <SkeletonTable columns={columnsModReports} />
              ) : (
                <Reports
                  data={reports}
                  userInfo={userInfo}
                  columns={columnsModReports}
                  activeTab={activeTab}
                  selectedNotificationId={selectedNotificationId}
                  setSelectedNotificationId={setSelectedNotificationId}
                />
              )}
            </TabsContent>

            {/* UNASSIGNED REPORTS 
                Shows unassigned reports based on infrastructure type
                e.g BAWADI will only see unassigned water infra related reports
            */}
            <TabsContent value="unassigned" className="h-[calc(100vh-11rem)]">
              {loadingUnassigned ? (
                <SkeletonTable columns={columnsModUnassigned} />
              ) : (
                <Unassigned
                  data={unassigned}
                  userInfo={userInfo}
                  columns={columnsModUnassigned}
                  activeTab={activeTab}
                  highlightedId={highlightedId}
                  setHighlightedId={setHighlightedId}
                  selectedNotificationId={selectedNotificationId}
                  setSelectedNotificationId={setSelectedNotificationId}
                />
              )}
            </TabsContent>

            {/* HIDDEN
                Contains reports that are hidden to the public view.
            */}
            <TabsContent value="hidden" className="h-[calc(100vh-11rem)]">
              {loadingHidden ? (
                <SkeletonTable columns={columnsModHidden} />
              ) : (
                <HiddenReports
                  data={hidden}
                  columns={columnsModHidden}
                  userInfo={userInfo}
                  activeTab={activeTab}
                  selectedNotificationId={selectedNotificationId}
                  setSelectedNotificationId={setSelectedNotificationId}
                />
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </HelmetProvider>
  );
};

export default ModeratorDashboardScreen;
