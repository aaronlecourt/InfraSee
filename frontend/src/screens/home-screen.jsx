import React from "react";
import { Button } from "@/components/ui/button"; // Adjust the import path as needed
import { useNavigate } from "react-router-dom";

function HomeScreen() {
  const navigate = useNavigate();

  const handleReportClick = () => {
    navigate("/report");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-[#0e0d0e] p-10 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-3xl font-extrabold mb-8 text-white">Welcome to InfraSee</h1>
        <p className="text-lg text-gray-300 mb-6">
          To help us improve, please make a report if you encounter any issues or have feedback.
        </p>
        <Button
          onClick={handleReportClick}
          className="bg-white hover:bg-gray-200 text-[#0e0d0e] font-semibold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e0d0e] transition duration-150 ease-in-out"
        >
          Make a Report
        </Button>
      </div>
    </div>
  );
}

export default HomeScreen;
