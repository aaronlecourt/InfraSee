import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Unlink } from "lucide-react";
import { Outlet } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

const MainModeratorRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  if (!userInfo?.isModerator || userInfo?.can_create === false) {
    return (
      <HelmetProvider>
        <div className="min-h-screen w-screen flex items-center justify-center bg-[url('/bg.jpg')] bg-cover bg-no-repeat">
          <Helmet>
            <title>{"InfraSee - Error"}</title>
          </Helmet>
          <div className="p-8 text-center max-w-md w-full">
            <div className="flex items-center">
              <Unlink strokeWidth={3} className="mr-2" />
              <h1 className="text-3xl">Unauthorized</h1>
            </div>
            <p className="text-base text-gray-500 text-left my-2">
              You do not have permission to access this page. If you believe
              this is an error, please contact support.
            </p>
            <div className="flex items-center justify-end">
              <ArrowLeft size={16} className="mr-2" />
              <button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="text-base font-semibold hover:underline"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </HelmetProvider>
    );
  }

  return <Outlet />;
};

export default MainModeratorRoute;
