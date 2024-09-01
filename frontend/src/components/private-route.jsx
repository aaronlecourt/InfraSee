import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo && userInfo.isModerator ? <Outlet /> : <Navigate to='/' replace />;
};
export default PrivateRoute;