import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { User, LogOut, FileStack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/slices/users-api-slice";
import { logout } from "@/slices/auth-slice";

const AdminDashboardScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [activeButton, setActiveButton] = useState("accounts");
  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = "Admin Dashboard | Infrasee";
  });


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

  const handleButtonClick = (logout) => {
    setActiveButton(buttonName);
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
      {/* desktop header */}
      <header className="h-screen border-r p-3 xl:block hidden">
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
              <p className="text-gray-500 font-normal text-sm leading-none">
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
            variant={activeButton === "logout" ? "default" : "ghost"}
            className={`text-sm w-full flex justify-between ${
              activeButton === "logout" ? "bg-black text-white" : ""
            }`}
            onClick={handleLogout}
          >
            <div className="flex items-center">
              <LogOut className="mr-2 h-5 w-5" />
              <span>Log out</span>
            </div>
            <div className="text-xs font-normal opacity-60">⌘+L</div>
          </Button>
        </div>
      </header>

      {/* mobile header */}
      <header className="border-b p-3 xl:hidden block">
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
              <p className="text-gray-500 font-normal text-sm leading-none">
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
              variant={activeButton === "logout" ? "default" : "ghost"}
              className={`text-sm w-full gap-2 flex justify-between ${
                activeButton === "logout" ? "bg-black text-white" : ""
              }`}
              onClick={() => handleButtonClick("logout")}
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
      </header>

      {/* Main content */}
      <main className="xl:col-span-4 p-4">
        {/* Your main content goes here */}
      </main>
    </div>
  );
};

export default AdminDashboardScreen;
