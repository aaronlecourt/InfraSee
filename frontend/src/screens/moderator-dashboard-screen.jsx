import React, { useEffect } from "react";
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
import { Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSelector } from "react-redux";

const ModeratorDashboardScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth); // Access user info from Redux store

  // Handle the keyboard shortcut for logout
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "l") {
        event.preventDefault(); // Prevent the default action
        handleLogout(); // Trigger logout
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

  const handleLogout = () => {
    // Implement your logout logic here
    navigate("/moderator/login");
  };

  return (
    <div>
      <header className="w-full h-fit p-3 flex items-center justify-between border-b border-slate-400">
        <div className="w-[6rem] mt-1 cursor-pointer" onClick={handleLogoClick}>
          <img src="/infrasee_black.png" alt="Infrasee Logomark" />
        </div>
        <div className="relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="hover:ring-4 ring-slate-300 cursor-pointer">
                {/* <AvatarImage src="/mod_icon.jpg" /> */}
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
                </DropdownMenuLabel> // Display user's name
              )}
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                  <DropdownMenuShortcut>⌘+L</DropdownMenuShortcut>{" "}
                  {/* Shortcut key for logout */}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </div>
  );
};

export default ModeratorDashboardScreen;
