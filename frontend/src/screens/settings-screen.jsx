import React, { useState, useEffect } from "react";
import ModNavbar from "@/components/elements/mod-navbar/navbar";
import socket from "@/utils/socket-connect";
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
import SubModNavbar from "@/components/elements/mod-navbar/submodnavbar";
import { toast } from "sonner";

const fetchUserProfile = async () => {
  const response = await axios.get("/api/users/profile");
  return response.data;
};

function SettingsScreen() {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("account");
  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);

  const loadUserProfile = async () => {
    if (userInfo?._id) {
      try {
        const userProfile = await fetchUserProfile();
        setUser(userProfile);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    }
  };

  if (!user) {
    loadUserProfile();
  }

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
  console.log(userInfo);
  return (
    <HelmetProvider>
      <div className="">
        <Helmet>
          <title>{"InfraSee | Settings"}</title>
        </Helmet>
        {userInfo.isModerator ? (
          <ModNavbar userInfo={userInfo} />
        ) : (
          <SubModNavbar userInfo={userInfo} />
        )}
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
              {/* <TabsTrigger value="report_form">Report Form</TabsTrigger> */}
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
          </div>
          <div className="col-span-1 lg:col-span-7 py-2 px-4">
            <TabsContent value="account">
              <ModAccount user={user} userInfo={userInfo} />
            </TabsContent>
            <TabsContent value="report_form">
              <ModReport user={user} />
            </TabsContent>
            <TabsContent value="security">
              <ModSecurity user={user} />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </HelmetProvider>
  );
}

export default SettingsScreen;
