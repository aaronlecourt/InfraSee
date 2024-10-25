import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQScreen = () => {
  const navigate = useNavigate();

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
    <div>
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
      </header>

      <main className="px-10 py-5">
        <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
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
  );
}

export default FAQScreen;
