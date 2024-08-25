import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (userInfo && userInfo.isAdmin) {
    return <Outlet />;
  } else {
    return <Navigate to='/unauthorized' replace />;
  }
};

export default AdminRoute;
