import React from 'react';
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client';
import App from './App.jsx'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import './index.css'
import store from './store.js';
import { Provider } from 'react-redux';
import HomeScreen from './screens/home-screen.jsx';
import LoginScreen from './screens/login-screen.jsx';
import ReportScreen from './screens/report-screen.jsx';
import PrivateRoute from './components/private-route.jsx';
import SettingsScreen from './screens/settings-screen.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/report' element={<ReportScreen />} />
      <Route path='' element={<PrivateRoute />}>
        <Route path='/settings' element={<SettingsScreen />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);