import React, { useState, useEffect } from "react";
import socket from "@/utils/socket-connect";
import { Spinner } from "@/components/ui/spinner";
import { useSelector, useDispatch } from "react-redux";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Helmet, HelmetProvider } from "react-helmet-async";
import axios from "axios";
import ModNavbar from "@/components/elements/mod-navbar/navbar";
import { columnsMainModAccounts } from "@/components/data-table/columns/columnsMainModAccounts";
import { DataTable } from "@/components/ui/DataTable";
import { useLogoutMutation } from "@/slices/users-api-slice";
import { logout } from "@/slices/auth-slice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
// Fetch Submoderators
const fetchSubModerators = async () => {
  const response = await axios.get("/api/users/submoderators-list");
  return response.data;
};

// Fetch secondary moderators
const fetchSecondaryMods = async () => {
  const response = await axios.get("/api/users/secondary-mods");
  return response.data;
};

const fetchDeactivated = async () => {
  const response = await axios.get("/api/users/deactivated-mods");
  return response.data;
};

const ModeratorAccountsScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("mods");
  const [secondaryMods, setSecondaryMods] = useState([]);
  const [subMods, setSubMods] = useState([]);
  const [deactivated, setDeactivated] = useState([]);
  const [loadingSecondaryMods, setLoadingSecondaryMods] = useState(true);
  const [loadingSubMods, setLoadingSubMods] = useState(true);
  const [loadingDeactivated, setLoadingDeactivated] = useState(true);
    const [logoutApiCall] = useLogoutMutation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

  const loadSecondaryMods = async () => {
    setLoadingSecondaryMods(true);
    try {
      const data = await fetchSecondaryMods();
      setSecondaryMods(data);
    } catch (error) {
      console.error("Failed to fetch secondary moderators", error);
    } finally {
      setLoadingSecondaryMods(false);
    }
  };

  const loadSubMods = async () => {
    setLoadingSubMods(true);
    try {
      const data = await fetchSubModerators();
      setSubMods(data);
    } catch (error) {
      console.error("Failed to fetch sub moderators", error);
    } finally {
      setLoadingSubMods(false);
    }
  };

  const loadDeactivated = async () => {
    setLoadingDeactivated(true);
    try {
      const data = await fetchDeactivated();
      setDeactivated(data);
    } catch (error) {
      console.error("Failed to fetch deactivated accounts", error);
    } finally {
      setLoadingDeactivated(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadSecondaryMods();  // Fetch secondary moderators on load
    loadSubMods();
    loadDeactivated();
  }, []);

  useEffect(() => {
    const handleUserChange = async () => {
      await loadSecondaryMods();
      await loadSubMods();
      await loadDeactivated();
    };

    socket.on("userChange", handleUserChange);

    // Cleanup the listener when component unmounts
    return () => socket.off("userChange", handleUserChange);
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

  return (
    <HelmetProvider>
      <div>
        <Helmet>
          <title>{"InfraSee | Manage Accounts"}</title>
        </Helmet>
        <div className="sticky top-0 z-20 bg-white">
          <ModNavbar
            userInfo={userInfo}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        <main className="p-4">
          <h1 className="text-3xl">Manage Accounts</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center gap-2">
              <TabsList className="h-auto">
                {/* <TabsTrigger value="all">All</TabsTrigger> */}
                <TabsTrigger value="mods">Moderators</TabsTrigger>
                <TabsTrigger value="submods">Submoderators</TabsTrigger>
                <TabsTrigger value="deactivated">Deactivated</TabsTrigger>
              </TabsList>
            </div>

            {/* SECONDARY MODERATORS */}
            <TabsContent value="mods" className="h-[calc(100vh-11rem)]">
              {loadingSecondaryMods ? (
                <div className="flex justify-center items-center h-full">
                  <Spinner size="large" />
                </div>
              ) : (
                <div>
                  {/* <h2 className="text-xl">Secondary Moderators</h2> */}
                  <DataTable
                    activeTab={activeTab}
                    data={secondaryMods} // Data for secondary moderators
                    columns={columnsMainModAccounts} // Assuming columns for the moderators data
                    userInfo={userInfo}
                  />
                </div>
              )}
            </TabsContent>

            {/* SUBMODERATORS */}
            <TabsContent value="submods" className="h-[calc(100vh-11rem)]">
              {loadingSubMods ? (
                <div className="flex justify-center items-center h-full">
                  <Spinner size="large" />
                </div>
              ) : (
                <div>
                  {/* <h2 className="text-xl">Secondary Moderators</h2> */}
                  <DataTable
                    activeTab={activeTab}
                    data={subMods} // Data for secondary moderators
                    columns={columnsMainModAccounts} // Assuming columns for the moderators data
                    userInfo={userInfo}
                  />
                </div>
              )}
            </TabsContent>

            {/* DEACTIVATED */}
            <TabsContent value="deactivated" className="h-[calc(100vh-11rem)]">
              {loadingDeactivated ? (
                <div className="flex justify-center items-center h-full">
                  <Spinner size="large" />
                </div>
              ) : (
                <div>
                  {/* <h2 className="text-xl">Secondary Moderators</h2> */}
                  <DataTable
                    activeTab={activeTab}
                    data={deactivated} // Data for secondary moderators
                    columns={columnsMainModAccounts} // Assuming columns for the moderators data
                    userInfo={userInfo}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </HelmetProvider>
  );
};

export default ModeratorAccountsScreen;
