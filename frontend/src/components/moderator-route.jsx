import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ModeratorRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    console.log("Current userInfo:", userInfo);
    console.log("Current location:", location);
  }, [userInfo, location]);

  if (userInfo && userInfo.isModerator) {
    return <Outlet />;
  } else {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }
};

export default ModeratorRoute;
