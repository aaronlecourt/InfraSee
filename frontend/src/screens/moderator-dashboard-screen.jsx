import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
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

  const [report_data, setreport_Data] = useState([]);
  const [archive_data, setArchiveData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchReports, fetchArchives] = await Promise.all([
          axios.get("/api/reports/moderator/reports"),
          axios.get("/api/reports/archived/reports"),
        ]);
        setreport_Data(fetchReports.data);
        setArchiveData(fetchArchives.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [activeTab]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "l") {
        event.preventDefault();
        handleLogout();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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

  const goToReportsTab = () => {
    setActiveTab("reports");
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
                    <DropdownMenuShortcut>⌘+L</DropdownMenuShortcut>
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
              <Overview goToReportsTab={goToReportsTab} data={report_data} />
            </TabsContent>
            <TabsContent value="reports" className="h-[calc(100vh-11rem)]">
              <Reports data={report_data} columns={columnsModReports} />
            </TabsContent>
            <TabsContent value="archives">
              <Archives data={archive_data} columns={columnsModArchives} />
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
