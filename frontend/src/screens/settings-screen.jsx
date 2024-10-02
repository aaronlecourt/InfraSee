import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { Settings, LogOut, LucideLayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "@/slices/users-api-slice";
import { logout } from "@/slices/auth-slice";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/vertical_tabs";
import { ModSecurity } from "@/components/elements/mod-security";
import { ModReport } from "@/components/elements/mod-report";
import { ModAccount } from "@/components/elements/mod-account";
import axios from "axios";

function SettingsScreen() {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("account"); // Manage active tab state
  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();
  const [moderator, setModerator] = useState(null);
  
  // Fetch moderators and filter the one matching userInfo.id
  useEffect(() => {
    const fetchModerator = async () => {
      try {
        const response = await axios.get("/api/users/moderators/");
        const moderators = response.data;
        const foundModerator = moderators.find((mod) => mod._id === userInfo._id);
        setModerator(foundModerator);
      } catch (error) {
        console.error("Failed to fetch moderators", error);
      }
    };

    if (userInfo?._id) {
      fetchModerator();
    }
  }, [userInfo]);

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
  console.log()
  return (
    <HelmetProvider>
      <div className="">
        <Helmet>
          <title>{"InfraSee | Settings"}</title>
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
                  <DropdownMenuItem
                    onClick={() => navigate("/moderator/dashboard")}
                  >
                    <LucideLayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Go to Dashboard</span>
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
      </div>
      <main className="p-4">
        <h1 className="text-3xl mb-1">Settings</h1>
        <p className="text-gray-500 text-sm mb-4">
          Manage your account settings and other preferences.
        </p>
        <hr />

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="mt-2 grid grid-cols-1 lg:grid-cols-8"
        >
          <div className="col-span-1 lg:col-span-1 lg:p-2">
            <TabsList className="flex flex-row lg:flex-col h-full gap-y-2">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="report_form">Report Form</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
          </div>
          <div className="col-span-1 lg:col-span-7 py-2 px-4">
            <TabsContent value="account">
              <ModAccount user={moderator} />
            </TabsContent>
            <TabsContent value="report_form">
              <ModReport user={moderator} />
            </TabsContent>
            <TabsContent value="security">
              <ModSecurity user={moderator} />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </HelmetProvider>
  );
}

export default SettingsScreen;
