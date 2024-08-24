import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { ArrowRight } from "lucide-react";

function HomeScreen() {
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
    <div className="bg-[url('../public/bg.jpg')] bg-cover bg-no-repeat bg-bottom min-h-screen flex-row overflow-hidden">
      <div className="w-full h-fit p-3 flex align-middle justify-between border-b border-slate-400">
        <div className="w-[6rem] mt-1" onClick={handleLogoClick}>
          <img src="/infrasee_black.png" alt="Infrasee Logomark" />
        </div>
        <div>
          <Button onClick={handleContactClick} variant="ghost">
            Contact Us
          </Button>
          <Button onClick={handleReportClick} className="">
            Make a Report
          </Button>
        </div>
      </div>

      <div className="px-12 py-5 flex-row lg:w-2/5">
        <small className="flex items-center">
          <p>Introducing Infrasee</p>
          <ArrowRight size={15} />
        </small>
        <h1 className="text-6xl">
          A one-stop tool for reporting infrastructure damage.
        </h1>
        <p className="text-base text-slate-500">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
        <div className="mt-2 bg-white/30 rounded-md">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1"  className="pl-3">
              <AccordionTrigger>How do I make a report?</AccordionTrigger>
              <AccordionContent>
                You can make a report by clicking on the 'Make a Report' button. Begin by choosing an appropriate infrastructure type, then choose an associated moderator, then fill up their report form.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2"  className="pl-3">
              <AccordionTrigger>Who sees my reports?</AccordionTrigger>
              <AccordionContent>
                Moderators, which are representatives from infrastructure companies like BAWADI or BENECO, are the ones that receive and monitor the reports that you send.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3"  className="pl-3">
              <AccordionTrigger>Can I receive feedback?</AccordionTrigger>
              <AccordionContent>
                Yes. Feedbacks are relayed as status reports, you can always check them via the report map markers.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4"  className="pl-3">
              <AccordionTrigger>How do I apply as a moderator?</AccordionTrigger>
              <AccordionContent>
                Moderator application starts by sending a notice to our email: admin@a.infrasee.com
                Your application will be verified by your company. Valid applications are sent with the login link and their account details.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
