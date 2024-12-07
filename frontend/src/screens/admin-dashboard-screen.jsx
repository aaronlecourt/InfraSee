import React, { useState, useEffect } from "react";
import axios from "axios";
import socket from "@/utils/socket-connect";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { User, LogOut, FileStack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/slices/users-api-slice";
import { logout } from "@/slices/auth-slice";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { DataTable } from "@/components/ui/DataTable";
import { columnsAccounts } from "@/components/data-table/columns/columnsAccounts";
import { columnsReports } from "@/components/data-table/columns/columnsReports";
import { columnsSubMod } from "@/components/data-table/columns/columnsSubMod";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Fetch functions
const fetchAll = async () => {
  const response = await axios.get("/api/users/moderators");
  return response.data;
};

const fetchModerators = async () => {
  const response = await axios.get("/api/users/moderators-list");
  return response.data;
};

const fetchSubModerators = async () => {
  const response = await axios.get("/api/users/submoderators-list");
  return response.data;
};

const fetchDeactivated = async () => {
  const response = await axios.get("/api/users/deactivated");
  return response.data;
};

const fetchReports = async () => {
  const response = await axios.get("/api/reports/");
  return response.data;
};

const AdminDashboardScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("moderators");
  const [activeButton, setActiveButton] = useState("accounts");
  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();

  const [accountsData, setAccountsData] = useState([]);
  const [moderatorsData, setModeratorsData] = useState([]);
  const [subModeratorsData, setSubModeratorsData] = useState([]);
  const [deactivatedData, setDeactivatedData] = useState([]);
  const [reportsData, setReportsData] = useState([]);

  const [accountsCount, setAccountsCount] = useState(0);
  const [reportsCount, setReportsCount] = useState(0);

  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [loadingModerators, setLoadingModerators] = useState(true);
  const [loadingSubModerators, setLoadingSubModerators] = useState(true);
  const [loadingDeactivated, setLoadingDeactivated] = useState(true);

  useEffect(() => {
    const handleUserChange = async () => {
      await loadAccounts();
      await loadReports();
      await loadModerators();
      await loadSubModerators();
      await loadDeactivated();
    };

    socket.on("userChange", handleUserChange);

    // Cleanup the listener when component unmounts
    return () => socket.off("userChange", handleUserChange);
  }, []);

  const loadAccounts = async () => {
    setLoadingAccounts(true);
    try {
      const data = await fetchAll();
      setAccountsData(data);
      // setAccountsCount(data.length);
    } catch (error) {
      console.error("Failed to fetch accounts", error);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const loadModerators = async () => {
    setLoadingModerators(true);
    try {
      const data = await fetchModerators();
      const filteredModerators = data.filter((mod) => !mod.isSubModerator);
      setModeratorsData(filteredModerators);
      setAccountsCount(data.length);
    } catch (error) {
      console.error("Failed to fetch moderators", error);
    } finally {
      setLoadingModerators(false);
    }
  };

  const loadSubModerators = async () => {
    setLoadingSubModerators(true);
    try {
      const data = await fetchSubModerators();
      setSubModeratorsData(data);
    } catch (error) {
      console.error("Failed to fetch sub-moderators", error);
    } finally {
      setLoadingSubModerators(false);
    }
  };

  const loadDeactivated = async () => {
    setLoadingDeactivated(true);
    try {
      const data = await fetchDeactivated();
      setDeactivatedData(data);
    } catch (error) {
      console.error("Failed to fetch deactivated users", error);
    } finally {
      setLoadingDeactivated(false);
    }
  };

  const loadReports = async () => {
    setLoadingReports(true);
    try {
      const data = await fetchReports();
      setReportsData(data);
      setReportsCount(data.length);
    } catch (error) {
      console.error("Failed to fetch reports", error);
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    loadAccounts();
    loadReports();
    loadModerators();
    loadSubModerators();
    loadDeactivated();
  }, []);

  // Handle the keyboard shortcut for logout
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

  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/admin/login");
    } catch (err) {
      console.log(err);
    }
  };

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
    if (buttonName === "accounts") {
      navigate("/admin/dashboard");
    } else if (buttonName === "reports") {
      navigate("/admin/reports");
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5">
      <HelmetProvider>
        <Helmet>
          <title>{"InfraSee | Admin Dashboard"}</title>
        </Helmet>

        {/* desktop div */}
        <div className="border-r p-3 xl:block hidden">
          <div className="border rounded-lg p-2 flex gap-2 items-center justify-start">
            <div>
              <Avatar className="h-8 w-8 hover:ring-4 ring-slate-300 cursor-pointer">
                <AvatarFallback className="text-white bg-slate-950">
                  A
                </AvatarFallback>
              </Avatar>
            </div>
            {userInfo && (
              <div className="flex flex-col">
                <p className="font-bold leading-none">{userInfo.name}</p>
                <p className="font-normal text-xs text-gray-500">
                  {userInfo.email}
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <Button
              variant={activeButton === "accounts" ? "default" : "ghost"}
              className={`text-sm w-full flex justify-between ${
                activeButton === "accounts" ? "bg-black text-white" : ""
              }`}
              onClick={() => handleButtonClick("accounts")}
            >
              <div className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                <span>Accounts</span>
              </div>
              <div>{accountsCount}</div> {/* Display accounts count */}
            </Button>

            <Button
              variant={activeButton === "reports" ? "default" : "ghost"}
              className={`text-sm w-full flex justify-between ${
                activeButton === "reports" ? "bg-black text-white" : ""
              }`}
              onClick={() => handleButtonClick("reports")}
            >
              <div className="flex items-center">
                <FileStack className="mr-2 h-5 w-5" />
                <span>Reports</span>
              </div>
              <div>{reportsCount}</div> {/* Display reports count */}
            </Button>

            <Button
              variant="ghost"
              className="text-sm w-full flex justify-between"
              onClick={handleLogout}
            >
              <div className="flex items-center">
                <LogOut className="mr-2 h-5 w-5" />
                <span>Log out</span>
              </div>
              <div className="text-xs opacity-60">⌘+L</div>
            </Button>
          </div>
        </div>

        {/* mobile div */}
        <div className="border-b p-3 xl:hidden block z-10 sticky top-0 bg-white">
          <div className="border rounded-lg p-2 flex gap-2 items-center justify-start">
            <div>
              <Avatar className="h-8 w-8 hover:ring-4 ring-slate-300 cursor-pointer">
                <AvatarFallback className="text-white bg-slate-950">
                  A
                </AvatarFallback>
              </Avatar>
            </div>
            {userInfo && (
              <div className="flex flex-col">
                <p className="font-bold leading-none">{userInfo.name}</p>
                <p className="font-normal text-xs text-gray-500">
                  {userInfo.email}
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-between gap-2 mt-2">
            <div className="flex">
              <Button
                variant={activeButton === "accounts" ? "default" : "ghost"}
                className={`text-sm w-full gap-2 flex justify-between ${
                  activeButton === "accounts" ? "bg-black text-white" : ""
                }`}
                onClick={() => handleButtonClick("accounts")}
              >
                <div className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  <span className="hidden sm:block">Accounts</span>
                </div>
                <div>{accountsCount}</div> {/* Display accounts count */}
              </Button>

              <Button
                variant={activeButton === "reports" ? "default" : "ghost"}
                className={`text-sm w-full gap-2 flex justify-between ${
                  activeButton === "reports" ? "bg-black text-white" : ""
                }`}
                onClick={() => handleButtonClick("reports")}
              >
                <div className="flex items-center">
                  <FileStack className="mr-2 h-5 w-5" />
                  <span className="hidden sm:block">Reports</span>
                </div>
                <div>{reportsCount}</div> {/* Display reports count */}
              </Button>
            </div>
            <div>
              <Button
                variant="ghost"
                className="text-sm w-full flex gap-3 justify-between"
                onClick={handleLogout}
              >
                <div className="flex items-center">
                  <LogOut className="mr-2 h-5 w-5" />
                  <span className="hidden sm:block">Log out</span>
                </div>
                <div className="text-xs font-normal opacity-60 hidden sm:block">
                  ⌘+L
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Content section */}
        <div className="xl:col-span-4 p-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-bold text-gray-900">Accounts</h1>
            <span className="text-sm text-muted-foreground">
              Manage all your main moderators' accounts in this page.
            </span>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex items-center gap-2">
                <TabsList className="h-auto">
                  {/* <TabsTrigger value="all">All</TabsTrigger> */}
                  <TabsTrigger value="moderators">Moderators</TabsTrigger>
                  {/* <TabsTrigger value="submoderators">
                    Sub Moderators
                  </TabsTrigger> */}
                  <TabsTrigger value="deactivated">Deactivated</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="all">
                {loadingAccounts ? (
                  <div className="flex flex-col gap-2 items-center justify-center h-full">
                    <Spinner size="large" />
                    <span className="text-sm text-muted-foreground">
                      Loading All Accounts
                    </span>
                  </div>
                ) : (
                  <DataTable
                    activeTab={activeTab}
                    activeButton={activeButton}
                    data={accountsData}
                    columns={columnsAccounts}
                    userInfo={userInfo}
                  />
                )}
              </TabsContent>
              <TabsContent value="moderators">
                {loadingModerators ? (
                  <div className="flex flex-col gap-2 items-center justify-center h-full">
                    <Spinner size="large" />
                    <span className="text-sm text-muted-foreground">
                      Loading Moderators
                    </span>
                  </div>
                ) : (
                  <DataTable
                    activeTab={activeTab}
                    activeButton={activeButton}
                    data={moderatorsData}
                    columns={columnsAccounts}
                    userInfo={userInfo}
                  />
                )}
              </TabsContent>
              <TabsContent value="submoderators">
                {loadingSubModerators ? (
                  <div className="flex flex-col gap-2 items-center justify-center h-full">
                    <Spinner size="large" />
                    <span className="text-sm text-muted-foreground">
                      Loading Submoderators
                    </span>
                  </div>
                ) : (
                  <DataTable
                    activeTab={activeTab}
                    activeButton={activeButton}
                    data={subModeratorsData}
                    columns={columnsSubMod}
                    userInfo={userInfo}
                  />
                )}
              </TabsContent>
              <TabsContent value="deactivated">
                {loadingDeactivated ? (
                  <div className="flex flex-col gap-2 items-center justify-center h-full">
                    <Spinner size="large" />
                    <span className="text-sm text-muted-foreground">
                      Loading Deactivated Accounts
                    </span>
                  </div>
                ) : (
                  <DataTable
                    activeTab={activeTab}
                    activeButton={activeButton}
                    data={deactivatedData}
                    columns={columnsAccounts}
                    userInfo={userInfo}
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </HelmetProvider>
    </div>
  );
};

export default AdminDashboardScreen;
