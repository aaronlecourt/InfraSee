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
import ContactUsScreen from "./screens/contact-us-screen.jsx";
import AdminLoginScreen from "./screens/admin-login-screen.jsx";
import ReportScreen from "./screens/report-screen.jsx";
import PrivateRoute from "./components/private-route.jsx";
import SubModeratorRoute from "./components/sub-moderator-route.jsx";
import SettingsScreen from "./screens/settings-screen.jsx";
import ModeratorLoginScreen from "./screens/moderator-login-screen.jsx";
import SubModeratorDashboardScreen from "./screens/sub-moderator-dashboard-screen.jsx";
import AdminDashboardScreen from "./screens/admin-dashboard-screen.jsx";
import ModeratorDashboardScreen from "./screens/moderator-dashboard-screen.jsx";
import AdminRoute from "./components/admin-route.jsx";
import ModeratorRoute from "./components/moderator-route.jsx";
import NotFoundPage from "./screens/not-found-screen.jsx";
import AdminReportsScreen from "./screens/admin-reports.jsx";
import UnauthorizedPage from "./screens/unauthorized-screen.jsx";
import { FormProvider } from "./FormContext"; // Import FormProvider

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<HomeScreen />} />
      <Route path="/contact-us" element={<ContactUsScreen/>} />
      <Route path="/admin/login" element={<AdminLoginScreen />} />
      <Route path="/moderator/login" element={<ModeratorLoginScreen />} />
      <Route path="/report" element={<ReportScreen />} />

      {/* Private/Moderator routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/settings" element={<SettingsScreen />} />
      </Route>

      {/* Moderator routes */}
      <Route element={<ModeratorRoute />}>
        <Route
          path="/moderator/dashboard"
          element={<ModeratorDashboardScreen />}
        />
      </Route>

      {/* Submoderator routes */}
      <Route element={<SubModeratorRoute />}>
        <Route path="/submoderator/dashboard" element={<SubModeratorDashboardScreen />} />
        {/* Add more submoderator-specific routes as needed */}
      </Route>

      {/* Admin routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboardScreen />} />
        <Route path="/admin/reports" element={<AdminReportsScreen />} />
      </Route>

      {/* Uncomment if needed */}
      {/* <Route path="/unauthorized" element={<UnauthorizedPage />} /> */}
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
        <FormProvider>
          <RouterProvider router={router} />
        </FormProvider>
    </React.StrictMode>
  </Provider>
);
