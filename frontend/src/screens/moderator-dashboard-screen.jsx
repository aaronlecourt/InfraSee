import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Overview } from "@/components/elements/overview";
import { Archives } from "@/components/elements/archives";
import { Reports } from "@/components/elements/reports";
import { Analytics } from "@/components/elements/analytics";
import { useLogoutMutation } from "@/slices/users-api-slice";
import { logout } from "@/slices/auth-slice";
import { Helmet, HelmetProvider } from "react-helmet-async";
import axios from "axios";
import { columnsModReports } from "@/components/data-table/columns/columnsModReports";
import { columnsModArchives } from "@/components/data-table/columns/columnsModArchives";

const ModeratorDashboardScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("overview");
  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();

  const [reportData, setReportData] = useState([]);
  const [archiveData, setArchiveData] = useState([]);

  // Fetch reports and archives without explicit promises
  const fetchData = async () => {
    const reportsEndpoint = "/api/reports/moderator/reports";
    const archivesEndpoint = "/api/reports/moderator/archived/reports";

    try {
      // Fetch reports
      const reportsResponse = await axios.get(reportsEndpoint);
      setReportData(reportsResponse.data);

      // Fetch archives
      const archivesResponse = await axios.get(archivesEndpoint);
      setArchiveData(archivesResponse.data);
    } catch (error) {
      // Improved error handling
      const errorMessage = error.response
        ? error.response.data.message ||
          "An error occurred while fetching data."
        : error.message || "Network error. Please try again later.";

      console.error("Error fetching data:", errorMessage);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // WebSocket setup for auto-refreshing based on message type
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:5000");

    socket.onopen = () => console.log("WebSocket connection established");

    socket.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        console.log("New Data from WebSocket:", newData);

        const updatedReport = JSON.parse(newData.responseBody).report;

        handleWebSocketUpdate(newData, updatedReport);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.onclose = () => console.log("WebSocket connection closed");

    return () => {
      socket.close();
    };
  }, []);

  const handleWebSocketUpdate = (newData, updatedReport) => {
    if (newData.method === "PUT") {
      if (
        newData.url.includes("/api/reports/archive/") &&
        updatedReport.is_archived
      ) {
        setReportData((prevData) =>
          prevData.filter((report) => report._id !== updatedReport._id)
        );
        setArchiveData((prevData) => [updatedReport, ...prevData]);
        fetchData(); // Refresh data after actions
      } else if (
        newData.url.includes("/api/reports/restore/") &&
        !updatedReport.is_archived
      ) {
        setArchiveData((prevData) =>
          prevData.filter((archive) => archive._id !== updatedReport._id)
        );
        setReportData((prevData) => [updatedReport, ...prevData]);
        fetchData();
      } else if (newData.url.includes("/api/reports/status/")) {
        setReportData((prevData) =>
          prevData.map((report) =>
            report._id === updatedReport._id ? updatedReport : report
          )
        );
        fetchData();
      }
    } else if (
      newData.method === "DELETE" &&
      newData.url.includes("/api/reports/delete/")
    ) {
      const reportId = newData.url.split("/").pop(); // Extracts the last part of the URL
      setArchiveData((prevData) =>
        prevData.filter((archive) => archive._id !== reportId)
      );
      setReportData((prevData) =>
        prevData.filter((report) => report._id !== reportId)
      );
      fetchData();
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/moderator/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <HelmetProvider>
      <div>
        <Helmet>
          <title>{"InfraSee | Moderator Dashboard"}</title>
        </Helmet>
        <header className="w-full h-fit p-3 flex items-center justify-between border-b border-slate-400">
          <div
            className="w-[6rem] mt-1 cursor-pointer"
            onClick={handleLogoClick}
          >
            <img src="/infrasee_black.png" alt="Infrasee Logomark" />
          </div>
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 hover:ring-4 ring-slate-300 cursor-pointer">
                  <AvatarFallback className="text-white bg-slate-950">
                    M
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mr-3">
                {userInfo && (
                  <DropdownMenuLabel>
                    <p>{userInfo.name}</p>
                    <small className="text-gray-500 font-normal">
                      {userInfo.email}
                    </small>
                  </DropdownMenuLabel>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Go to Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="p-4">
          <h1 className="text-3xl mb-1">Dashboard</h1>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="archives">Archives</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="h-[calc(100vh-11rem)]">
              <Overview data={reportData} />
            </TabsContent>
            <TabsContent value="reports" className="h-[calc(100vh-11rem)]">
              <Reports data={reportData} columns={columnsModReports} activeTab={activeTab}/>
            </TabsContent>
            <TabsContent value="archives">
              <Archives data={archiveData} columns={columnsModArchives} activeTab={activeTab}/>
            </TabsContent>
            <TabsContent value="analytics">
              <Analytics />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </HelmetProvider>
  );
};

export default ModeratorDashboardScreen;
