import React, { useState, useRef, useEffect } from "react";
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
import { Settings, LogOut, LucideLayoutDashboard, Bell } from "lucide-react";

import { useLogoutMutation } from "@/slices/users-api-slice";
import { logout } from "@/slices/auth-slice";

const ModNavbar = ({ userInfo }) => {
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "New report submitted.",
      time: "2024-10-14T10:21:42.729+00:00",
    },
    {
      id: 2,
      message: "User JohnDoe commented on your report.",
      time: "2024-10-14T11:20:42.729+00:00",
    },
    {
      id: 3,
      message: "System maintenance scheduled for tonight.",
      time: "2024-10-14T11:31:42.729+00:00",
    },
    {
      id: 4,
      message: "New report submitted.",
      time: "2024-10-14T10:31:42.729+00:00",
    },
    {
      id: 5,
      message: "User JaneDoe commented on your report.",
      time: "2024-10-14T11:00:42.729+00:00",
    },
    {
      id: 6,
      message: "System maintenance scheduled for yesterday.",
      time: "2024-10-13T14:15:42.729+00:00",
    },
  ]);

  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

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

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const formatDateTime = (isoDate) => {
    const date = new Date(isoDate);
    const options = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const formattedDate = date.toLocaleString("en-US", options);

    // Transform to "MMM DD YYYY hh:mm AM/PM"
    const [month, dayYear, time] = formattedDate.split(", ");
    const [year] = dayYear.split(" ");
    return `${month} ${dayYear} ${time}`;
  };

  return (
    <header className="w-full h-fit p-3 flex items-center justify-between border-b border-slate-400">
      <div className="w-[6rem] mt-1 cursor-pointer" onClick={handleLogoClick}>
        <img src="/infrasee_black.png" alt="Infrasee Logomark" />
      </div>
      <div className="flex items-center gap-3">
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="outline"
            onClick={toggleNotifications}
            className="flex items-center h-8 w-8 p-0 rounded-full"
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-2">
                {notifications.length}
              </Badge>
            )}
          </Button>
          {showNotifications && (
            <div className="absolute right-0 z-10 max-h-[350px] w-48 bg-white border rounded-md overflow-y-auto cursor-default">
              <ul className="p-1">
                {notifications.map((notif) => (
                  <li
                    key={notif.id}
                    className="p-2 hover:bg-gray-100 text-xs font-medium border-b"
                  >
                    <span>{notif.message}</span>
                    <div className="text-[0.7rem] text-gray-500">
                      {formatDateTime(notif.time)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 hover:ring-4 ring-slate-200 cursor-pointer">
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
