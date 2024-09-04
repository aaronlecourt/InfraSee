import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose
} from "@/components/ui/sheet";
import { ArrowRight } from "lucide-react";
import { Helmet, HelmetProvider } from "react-helmet-async";

function HomeScreen() {
  const navigate = useNavigate();
  const [isSheetOpen, setSheetOpen] = useState(false);

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleContactClick = () => {
    navigate("/contact-us");
  };

  const handleReportClick = () => {
    navigate("/report");
  };

  return (
    <HelmetProvider>
      <div className="bg-[url('../bg.jpg')] bg-cover bg-no-repeat bg-bottom min-h-screen flex flex-col overflow-hidden">
        <Helmet>
          <title>{"InfraSee | Home"}</title>
        </Helmet>
        <header className="w-full h-fit p-3 flex items-center justify-between border-b border-slate-400">
          <div
            className="w-[6rem] mt-1 cursor-pointer"
            onClick={handleLogoClick}
          >
            <img src="/infrasee_black.png" alt="Infrasee Logomark" />
          </div>
          <nav className="hidden sm:flex">
            <Button onClick={handleContactClick} variant="ghost">
              Contact Us
            </Button>
            <Button onClick={handleReportClick}>Make a Report</Button>
          </nav>

          {/* Mobile menu button */}
          <div className="sm:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Open Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="top">
                <SheetHeader>
                  <SheetTitle className="hidden">Menu</SheetTitle>
                  <SheetDescription className="hidden">Select an option below:</SheetDescription>
                </SheetHeader>
                <nav className="grid gap-4">
                  <Button onClick={handleContactClick} variant="ghost">
                    Contact Us
                  </Button>
                  <Button onClick={handleReportClick}>Make a Report</Button>
                </nav>
                <SheetClose />
              </SheetContent>
            </Sheet>
          </div>
        </header>

        <main className="px-10 py-5 flex-col lg:w-2/5 md:px-8">
          <small className="flex items-center">
            <p>Introducing Infrasee</p>
            <ArrowRight size={15} />
          </small>
          <h1 className="text-6xl font-bold">
            A one-stop tool for reporting infrastructure damage.
          </h1>
          <p className="text-base text-slate-500 mt-3">
            We provide an easy way to report infrastructure issues, ensuring
            quick action and transparency.
          </p>

          <section className="mt-4 bg-white/30 rounded-md p-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I make a report?</AccordionTrigger>
                <AccordionContent>
                  Click on the 'Make a Report' button, select the infrastructure
                  type, choose a moderator, and complete the form.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Who sees my reports?</AccordionTrigger>
                <AccordionContent>
                  Your reports are sent to moderators representing
                  infrastructure companies like BAWADI or BENECO.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Can I receive feedback?</AccordionTrigger>
                <AccordionContent>
                  Yes, feedback is provided through status reports, which can be
                  viewed on the report map markers.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  How do I apply as a moderator?
                </AccordionTrigger>
                <AccordionContent>
                  Send an email to admin@a.infrasee.com with verification from
                  your company. Accepted applicants will receive login details.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </main>
      </div>
    </HelmetProvider>
  );
}

function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

export default HomeScreen;
