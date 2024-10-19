import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo && (userInfo.isModerator || userInfo.isSubModerator) 
  ? <Outlet /> 
  : <Navigate to='/moderator/login' replace />;
};
export default PrivateRoute;