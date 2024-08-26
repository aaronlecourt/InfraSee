import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner"; // Import Toaster from Sonner

const App = () => {
  return (
    <>
      <Toaster /> {/* Replacing ToastContainer with Toaster */}
      <Outlet />
    </>
  );
};

export default App;
