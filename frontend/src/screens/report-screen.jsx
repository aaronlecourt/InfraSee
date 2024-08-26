import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"; // Import the Sheet components
import { Menu } from "lucide-react"; // Use Lucide's Menu icon
import { useNavigate } from "react-router-dom";

import { ComboBoxResponsive } from "@/components/elements/combo";

function ReportScreen() {
  const navigate = useNavigate();
  const [isSheetOpen, setSheetOpen] = useState(false); // State to control the Sheet

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleContactClick = () => {
    navigate("/contact-us");
  };

  return (
    <div>
      <header className="w-full h-fit p-3 flex items-center justify-between border-b border-slate-400">
        <div className="w-[6rem] mt-1 cursor-pointer" onClick={handleLogoClick}>
          <img src="/infrasee_black.png" alt="Infrasee Logomark" />
        </div>
        <nav className="hidden sm:flex">
          <Button onClick={handleContactClick} variant="ghost">
            Contact Us
          </Button>
        </nav>

        {/* Mobile sheet trigger */}
        <div className="sm:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" /> {/* Lucide Menu Icon */}
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="top">
              <nav className="grid gap-4 py-1">
                <Button onClick={handleContactClick} variant="ghost">
                  Contact Us
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main>
        {/* Main content goes here */}
        combobox
        <ComboBoxResponsive/>
      </main>
    </div>
  );
}

export default ReportScreen;
