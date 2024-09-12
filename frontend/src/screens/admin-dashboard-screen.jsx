// src/pages/AdminDashboardScreen.jsx
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { User, LogOut, FileStack, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/slices/users-api-slice";
import { logout } from "@/slices/auth-slice";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { RegisterForm } from "@/components/elements/register-form";
import { DataTable } from "@/components/ui/DataTable";
import { columnsAccounts } from "@/components/data-table/columnsAccounts";
// import { columnsReports } from "@/components/data-table/columnsReports";
import axios from "axios";

const AdminDashboardScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [activeButton, setActiveButton] = useState("accounts");
  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Data table state
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from both endpoints concurrently
        const [fetchAccounts, fetchInfrastructureTypes] = await Promise.all([
          axios.get("/api/users/moderators"),
          axios.get("/api/infrastructure-types")
        ]);
  
        // Create a map of infrastructure types with infra_type as key and infra_name as value
        const infraTypeMap = fetchInfrastructureTypes.data.reduce((acc, infra) => {
          acc[infra._id] = infra.infra_name;
          return acc;
        }, {});
  
        // Map through accounts data and replace infra_type with infra_name
        const updatedAccounts = fetchAccounts.data.map(account => ({
          ...account,
          infra_name: infraTypeMap[account.infra_type] || account.infra_type // Default to original infra_type if no match found
        }));
  
        // Set the updated data to state
        setData(updatedAccounts);
        console.log(updatedAccounts); // For debugging
  
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [isDialogOpen]);

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

  const columns =
    activeButton === "accounts" ? columnsAccounts : columnsReports;

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
              <div>0</div>
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
              <div>0</div>
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
              <div className="text-xs font-normal opacity-60">⌘+L</div>
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
                <div>0</div>
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
                <div>0</div>
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
                Accounts
              </h1>
              <p className="text-sm text-gray-500">
                Manage the moderator accounts here.
              </p>
            </div>
            <div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="filter1"
                    size="filter"
                    className="flex items-center gap-2"
                  >
                    <Plus size={15} />
                    <p>New Account</p>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Account</DialogTitle>
                    <DialogDescription>
                      Add a new moderator account by filling up the form below.
                      Click add when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  {/* register form component here */}
                  <RegisterForm />
                  <DialogClose onClick={() => setIsDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <DataTable data={data} columns={columns} />
        </div>
      </HelmetProvider>
    </div>
  );
};

export default AdminDashboardScreen;
