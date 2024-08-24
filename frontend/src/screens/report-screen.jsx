import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function ReportScreen() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleContactClick = () => {
    navigate("/contact-us");
  };

  return (
    <>
      <div>
        <div className="w-full h-fit p-3 flex align-middle justify-between border-b border-slate-400">
          <div className="w-[6rem] mt-1" onClick={handleLogoClick}>
            <img src="/infrasee_black.png" alt="Infrasee Logomark" />
          </div>
          <div>
            <Button onClick={handleContactClick} variant="ghost">
              Contact Us
            </Button>
          </div>
        </div>
        <div>

        </div>
      </div>
    </>
  );
}

export default ReportScreen;
