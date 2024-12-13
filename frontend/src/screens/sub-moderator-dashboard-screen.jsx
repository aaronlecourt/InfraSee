import React, { useState, useEffect } from "react";
import socket from "@/utils/socket-connect";
import { Spinner } from "@/components/ui/spinner";
import { useSelector, useDispatch } from "react-redux";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { Helmet, HelmetProvider } from "react-helmet-async";
import axios from "axios";
import { columnsModReports } from "@/components/data-table/columns/columnsModReports";
import { SkeletonTable } from "@/components/elements/skeletontable";
import SubModNavbar from "@/components/elements/mod-navbar/submodnavbar";
import { columnsSubModReports } from "@/components/data-table/columns/columnsSubModReports";
import { SubOverview } from "@/components/elements/sub-overview";
import { SubReports } from "@/components/elements/sub-reports";
import { useLogoutMutation } from "@/slices/users-api-slice";
import { logout } from "@/slices/auth-slice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const fetchReports = async () => {
  const response = await axios.get("/api/reports/submoderator/reports");
  return response.data;
};

const SubModeratorDashboardScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("overview");
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);
  const [logoutApiCall] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("reportChange", (change) => {
      console.log("Received report change:", change);
      loadReports();
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

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    socket.on("userDeactivated", async (data) => {
      console.log("User deactivated:", data);
      if (data.userId === userInfo?._id) {
        toast.error("You have been deactivated. Please contact your Moderator.");
        try {
          await logoutApiCall().unwrap();
          dispatch(logout());
          navigate("/moderator/login");
        } catch (error) {
          console.error("Failed to log out after deactivation:", error);
        }
      }
    });

    return () => {
      socket.off("userDeactivated");
    };
  }, [logoutApiCall]);

  const goToReportsTab = () => {
    setActiveTab("reports");
  };

  const combinedReports = [...reports];

  return (
    <HelmetProvider>
      <div>
        <Helmet>
          <title>{"InfraSee | Sub-Moderator Dashboard"}</title>
        </Helmet>
        <div className="sticky top-0 z-20 bg-white">
          <SubModNavbar
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
              </TabsList>
            </div>

            {/* OVERVIEW */}
            <TabsContent value="overview" className="h-[calc(100vh-11rem)]">
              {loadingReports ? (
                <div className="flex justify-center items-center h-full">
                  <Spinner size="large" />
                </div>
              ) : (
                <SubOverview
                  goToReportsTab={goToReportsTab}
                  data={combinedReports}
                  userInfo={userInfo}
                  activeTab={activeTab}
                  selectedNotificationId={selectedNotificationId}
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
                <SubReports
                  data={reports}
                  userInfo={userInfo}
                  columns={columnsSubModReports}
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

export default SubModeratorDashboardScreen;
