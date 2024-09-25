import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { User, LogOut, FileStack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/slices/users-api-slice";
import { logout } from "@/slices/auth-slice";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { DataTable } from "@/components/ui/DataTable";
import axios from "axios";
import { columnsAccounts } from "@/components/data-table/columns/columnsAccounts";
import { columnsReports } from "@/components/data-table/columns/columnsReports";
import useWebSocket from "../../../backend/utils/websocket.js";

const AdminReportsScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [activeButton, setActiveButton] = useState("reports");
  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();
  const [accountsData, setAccountsData] = useState([]);
  const [reportsData, setReportsData] = useState([]);
  const [accountsCount, setAccountsCount] = useState(0);
  const [reportsCount, setReportsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const columns = activeButton === "reports" ? columnsReports : columnsAccounts;

  const fetchData = async () => {
    const accountsEndpoint = "/api/users/moderators";
    const reportsEndpoint = "/api/reports";
    setLoading(true);

    try {
      // Fetch accounts
      const accountsResponse = await axios.get(accountsEndpoint);
      setAccountsData(accountsResponse.data);

      // Fetch reports
      const reportsResponse = await axios.get(reportsEndpoint);
      setReportsData(reportsResponse.data);

      // Set counts based on the fetched data
      setAccountsCount(accountsResponse.data.length);
      setReportsCount(reportsResponse.data.length);
    } catch (error) {
      // Improved error handling
      const errorMessage = error.response
        ? error.response.data.message ||
          "An error occurred while fetching data."
        : error.message || "Network error. Please try again later.";

      console.error("Error fetching data:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleWebSocketUpdate = (newData) => {
    if (
      newData.method === "DELETE" &&
      newData.url.includes("/api/reports/delete/")
    ) {
      const reportId = newData.url.split("/").pop();
      setReportsData((prevData) =>
        prevData.filter((report) => report._id !== reportId)
      );
      fetchData();
    }
  };

  const parseUserData = (newData) => {
    return JSON.parse(newData.responseBody).report;
  };

  useWebSocket("ws://localhost:5000", handleWebSocketUpdate, parseUserData);

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

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
    if (buttonName === "accounts") {
      navigate("/admin/dashboard");
    } else if (buttonName === "reports") {
      navigate("/admin/reports");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/admin/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5">
      <HelmetProvider>
        <Helmet>
          <title>{"InfraSee | Reports"}</title>
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
        <div className="border-b p-3 xl:hidden block">
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

        {/* Main content */}
        <div className="xl:col-span-4 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1 text-gray-900">
                {activeButton === "reports" ? "Reports" : "Accounts"}
              </h1>
              <p className="text-sm text-gray-500">
                Manage all{" "}
                {activeButton === "reports" ? "reports" : "moderator accounts"}.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-full">
              <span className="text-lg">Loading...</span>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={activeButton === "reports" ? reportsData : accountsData}
            />
          )}
        </div>
      </HelmetProvider>
    </div>
  );
};

export default AdminReportsScreen;
