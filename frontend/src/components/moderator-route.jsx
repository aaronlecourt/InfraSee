import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ModeratorRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (userInfo && userInfo.isModerator) {
    return <Outlet />;
  } else {
    return <Navigate to='/unauthorized' replace />;
  }
};

export default ModeratorRoute;
