import React from "react";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import store from "./store.js";
import { Provider } from "react-redux";
import HomeScreen from "./screens/home-screen.jsx";
import AdminLoginScreen from "./screens/admin-login-screen.jsx";
import ReportScreen from "./screens/report-screen.jsx";
import PrivateRoute from "./components/private-route.jsx";
import SettingsScreen from "./screens/settings-screen.jsx";
import ModeratorLoginScreen from "./screens/moderator-login-screen.jsx";
import AdminDashboardScreen from "./screens/admin-dashboard-screen.jsx";
import ModeratorDashboardScreen from "./screens/moderator-dashboard-screen.jsx";
import AdminRoute from "./components/admin-route.jsx";
import ModeratorRoute from "./components/moderator-route.jsx";
import UnauthorizedPage from "./screens/unauthorized-screen.jsx";
import NotFoundPage from "./screens/not-found-screen.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<HomeScreen />} />
      <Route path="/admin/login" element={<AdminLoginScreen />} />
      <Route path="/moderator/login" element={<ModeratorLoginScreen />} />
      <Route path="/report" element={<ReportScreen />} />

      {/* Private routes */}
      <Route element={<PrivateRoute />}>
        {/* Moderator routes */}
        <Route path="/settings" element={<SettingsScreen />} />
      </Route>
      <Route element={<ModeratorRoute />}>
        <Route
          path="/moderator/dashboard"
          element={<ModeratorDashboardScreen />}
        />
      </Route>

      {/* Admin routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboardScreen />} />
      </Route>

      {/* <Route path="/unauthorized" element={<UnauthorizedPage />} /> */}
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
