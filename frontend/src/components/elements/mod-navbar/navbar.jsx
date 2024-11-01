import React, { useState, useEffect } from "react";
import socket from "@/utils/socket-connect";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Settings,
  LogOut,
  LucideLayoutDashboard,
  Bell,
  Ellipsis,
  DeleteIcon,
  Check,
} from "lucide-react";
import { useLogoutMutation } from "@/slices/users-api-slice";
import { logout } from "@/slices/auth-slice";
import axios from "axios";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

const fetchNotifications = async () => {
  const response = await axios.get("/api/notification/notifications");
  return response.data;
};

const ModNavbar = ({
  userInfo,
  activeTab,
  setActiveTab,
  setSelectedNotificationId,
}) => {
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  useEffect(() => {
    socket.on("notificationChange", (change) => {
      console.log("Received notification change:", change);
      loadNotifications();
    });

    return () => {
      socket.off("notificationChange");
    };
  }, []);

  const loadNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadNotifications();
  }, []);

  const handleLogoClick = () => {
    navigate("/moderator/dashboard");
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "MMMM dd, yyyy - hh:mm aa");
  };

  // useEffect(() => {
  //   const fetchNotifications = async () => {
  //     try {
  //       const response = await axios.get("/api/notification/notifications");
  //       setNotifications(response.data);
  //     } catch (error) {
  //       console.error("Failed to fetch notifications", error);
  //     }
  //   };

  //   fetchNotifications();
  // }, []);

  const markAsRead = async (notifId) => {
    try {
      await axios.put(`/api/notification/notifications/${notifId}/read`);
      toast.success("Successfully marked notification as read");
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };

  const markAsUnread = async (notifId) => {
    try {
      await axios.put(`/api/notification/notifications/${notifId}/unread`);
      toast.success("Successfully marked notification as unread");
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notifId ? { ...notif, is_read: false } : notif
        )
      );
    } catch (error) {
      toast.error("Failed to mark notification as unread");
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.is_read) {
      await markAsRead(notif._id);
    }

    // Fetch all reports
    const reports = await fetchAllReports();
    // Fetch hidden reports
    const hiddenReports = await fetchHiddenReports();

    // Find the specific report based on the notification
    const report = reports.find((report) => report._id === notif.report._id);
    const hiddenReport = hiddenReports.find(
      (report) => report._id === notif.report._id
    );

    // console.log("REPORT: ", report);
    // console.log("HIDDEN REPORT: ", hiddenReport);

    // Determine the active tab based on the report's status
    if (hiddenReport) {
      setActiveTab("hidden"); // Set to hidden if the report is found in hidden reports
    } else if (report && report.report_status.stat_name === "Unassigned") {
      setActiveTab("unassigned");
    } else {
      setActiveTab("reports");
    }

    // Set the selected notification ID
    setSelectedNotificationId(notif.report._id);
  };

  // Function to fetch all reports
  const fetchAllReports = async () => {
    try {
      const response = await axios.get(`/api/reports`);
      return response.data; // Assume the report data is in the response
    } catch (error) {
      console.error("Error fetching reports:", error);
      return []; // Return an empty array on error
    }
  };

  // Function to fetch hidden reports
  const fetchHiddenReports = async () => {
    try {
      const response = await axios.get(`/api/reports/hidden/reports`);
      return response.data; // Assume the hidden report data is in the response
    } catch (error) {
      console.error("Error fetching hidden reports:", error);
      return []; // Return an empty array on error
    }
  };

  const deleteNotification = async (notifId) => {
    try {
      await axios.delete(`/api/notification/notifications/${notifId}/delete`);
      setNotifications(notifications.filter((notif) => notif._id !== notifId));
      toast.success("Notification deleted successfully");
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  const unreadCount = notifications.filter((notif) => !notif.is_read).length;

  return (
    <header className="w-full h-fit p-3 flex items-center justify-between border-b border-slate-400">
      <div className="w-[6rem] mt-1 cursor-pointer" onClick={handleLogoClick}>
        <img src="/infrasee_black.png" alt="Infrasee Logomark" />
      </div>
      <div className="flex items-center gap-3">
        {activeTab && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="notification-button relative flex items-center h-8 w-8 p-0 rounded-full"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              side="bottom"
              className="shadow-sm absolute right-0 z-10 max-h-[350px] min-w-60 max-w-72 bg-white border rounded-md overflow-y-auto cursor-default p-0"
            >
              <ul className="p-1 flex flex-col gap-1">
                {notifications.length === 0 ? (
                  <li className="p-2 text-xs text-gray-500 font-medium">
                    You have no notifications.
                  </li>
                ) : (
                  notifications.map((notif) => (
                    <li
                      key={notif._id}
                      className={`p-2 hover:bg-gray-100 text-sm font-medium cursor-pointer`}
                      onClick={() => handleNotificationClick(notif)}
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`text-wrap ${
                              notif.is_read ? "text-gray-500/50" : ""
                            }`}
                            style={{
                              overflowWrap: "break-word",
                              wordBreak: "break-word",
                              maxWidth: "100%",
                            }}
                          >
                            {notif.message}
                          </span>
                          <div
                            className={`text-xs font-normal ${
                              notif.is_read
                                ? "text-gray-500/50"
                                : "text-gray-500"
                            }`}
                          >
                            {formatDate(notif.createdAt)}
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="p-1 rounded-full text-primary"
                            >
                              <Ellipsis size={14} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="shadow-sm"
                          >
                            {notif.is_read && (
                              <>
                                <DropdownMenuItem
                                  className="flex gap-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsUnread(notif._id);
                                  }}
                                >
                                  <Check size={14} />
                                  Mark as Unread
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}
                            <DropdownMenuItem
                              className="flex gap-2 text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notif._id);
                              }}
                            >
                              <DeleteIcon size={14} />
                              Delete Notif
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </PopoverContent>
          </Popover>
        )}

        <div className="relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 hover:ring-4 ring-slate-200 cursor-pointer">
                <AvatarFallback className="text-white bg-slate-950">
                  {userInfo.isModerator ? "M" : "S"}
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
              <DropdownMenuGroup>
                <DropdownMenuSeparator />
                {userInfo.isModerator ? (
                  <DropdownMenuItem
                    onClick={() => navigate("/moderator/dashboard")}
                  >
                    <LucideLayoutDashboard className="mr-2 h-4 w-4 text-slate-950" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => navigate("/submoderator/dashboard")}
                  >
                    <LucideLayoutDashboard className="mr-2 h-4 w-4 text-slate-950" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4 text-slate-950" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4 text-slate-950" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default ModNavbar;
