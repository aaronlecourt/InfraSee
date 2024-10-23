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
import { columnsModArchives } from "@/components/data-table/columns/columnsModArchives";
import { Button } from "@/components/ui/button";
import { SkeletonTable } from "@/components/elements/skeletontable";
import ModNavbar from "@/components/elements/mod-navbar/navbar";
import { columnsModUnassigned } from "@/components/data-table/columns/columnsModUnassigned";

const fetchReports = async () => {
  const response = await axios.get("/api/reports/submoderator/reports");
  return response.data;
};

const fetchUnassigned = async () => {
  const response = await axios.get("/api/reports/unassigned");
  return response.data;
};

const fetchArchives = async () => {
  const response = await axios.get(
    "/api/reports/submoderator/reports/archived"
  );
  return response.data;
};

const SubModeratorDashboardScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("overview");
  const [reports, setReports] = useState([]);
  const [unassigned, setUnassigned] = useState([]);
  const [archives, setArchives] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingArchives, setLoadingArchives] = useState(true);
  // const [loadingUnassigned, setLoadingUnassigned] = useState(true);

  useEffect(() => {
    socket.on("reportChange", (change) => {
      console.log("Received report change:", change);
      loadReports();
      // loadArchives();
      // loadUnassigned();
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
  
  {/* const loadUnassigned = async () => {
    setLoadingUnassigned(true);
    try {
      const data = await fetchUnassigned();
      setUnassigned(data);
    } catch (error) {
      console.error("Failed to fetch unassigned reports", error);
    } finally {
      setLoadingUnassigned(false);
    }
  };*/}

  {/* const loadArchives = async () => {
    setLoadingArchives(true);
    try {
      const data = await fetchArchives();
      setArchives(data);
    } catch (error) {
      console.error("Failed to fetch archives", error);
    } finally {
      setLoadingArchives(false);
    }
  };*/}

  // Initial load
  useEffect(() => {
    loadReports();
    // loadUnassigned();
    // loadArchives();
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
          <title>{"InfraSee | Sub-Moderator Dashboard"}</title>
        </Helmet>
        <ModNavbar userInfo={userInfo} />
        <main className="p-4">
          <h1 className="text-3xl">Dashboard</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center gap-2">
              <TabsList className="h-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                {/* <TabsTrigger value="unassigned">Unassigned</TabsTrigger>
                <TabsTrigger value="hidden">Hidden</TabsTrigger> */}
              </TabsList>
            </div>

            {/* OVERVIEW */}
            <TabsContent value="overview" className="h-[calc(100vh-11rem)]">
              {loadingReports ? (
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
                  columns={columnsModReports}
                  activeTab={activeTab}
                />
              )}
            </TabsContent>

            {/* UNASSIGNED REPORTS 
                Shows unassigned reports based on infrastructure type
                e.g BAWADI will only see unassigned water infra related reports
            */}
            {/* <TabsContent value="unassigned" className="h-[calc(100vh-11rem)]">
              <Unassigned
                data={unassigned}
                columns={columnsModUnassigned}
                activeTab={activeTab}
              />
            </TabsContent> */}

            {/* ARCHIVES/HIDDEN 
                Contains reports that are hidden to the public view.
            */}
            {/* <TabsContent value="hidden" className="h-[calc(100vh-11rem)]">
              {loadingArchives ? (
                <SkeletonTable columns={columnsModArchives} />
              ) : (
                <HiddenReports
                  data={archives}
                  columns={columnsModArchives}
                  activeTab={activeTab}
                />
              )}
            </TabsContent> */}

          </Tabs>
        </main>
      </div>
    </HelmetProvider>
  );
};

export default SubModeratorDashboardScreen;
