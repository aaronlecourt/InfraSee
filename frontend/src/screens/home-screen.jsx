import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function HomeScreen() {
  const navigate = useNavigate();

  const handleReportClick = () => {
    navigate("/report");
  };

  return (
    <div className="bg-[url('../public/bg.jpg')] bg-cover bg-no-repeat bg-bottom min-h-screen flex overflow-hidden">
    <div className="p-4">
    
    <Button onClick={handleReportClick} className="mt-4">Make a report</Button>
    </div>
    
    
  </div>

  
  );
}

export default HomeScreen;
