import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function HomeScreen() {
  const navigate = useNavigate();

  const handleReportClick = () => {
    navigate("/report");
  };

  return (
    <div>
      <h1>Landing Page</h1>
      <Button onClick={handleReportClick}>Make a report</Button>
    </div>
  );
}

export default HomeScreen;
