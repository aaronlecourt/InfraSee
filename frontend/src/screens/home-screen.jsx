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
  SheetClose,
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
                  <SheetDescription className="hidden">
                    Select an option below:
                  </SheetDescription>
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

        <main className="px-10 py-5 flex-col ">
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
                <AccordionTrigger>How do I report an issue?</AccordionTrigger>
                <AccordionContent>
                  To report an issue: <br />
                  <br />
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      Click the <strong>"Make a Report"</strong> button on the
                      homepage.
                    </li>
                    <li>
                      Select the type of infrastructure related to your issue.
                    </li>
                    <li>
                      Provide the following details:
                      <ul className="list-disc list-inside pl-4 space-y-1">
                        <li>Your name</li>
                        <li>A description of the problem</li>
                        <li>Any relevant images</li>
                        <li>Your contact information</li>
                      </ul>
                    </li>
                  </ul>
                  <br />
                  Once submitted, your report will be forwarded to the
                  appropriate companies in that infrastructure category. The
                  most suitable company will take responsibility for resolving
                  the issue. You will receive updates as your issue is being
                  addressed.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>
                  What information do I need to provide?
                </AccordionTrigger>
                <AccordionContent>
                  When reporting an issue, please include: <br />
                  <br />
                  <ul className="list-disc list-inside space-y-2">
                    <li>Your name</li>
                    <li>
                      A detailed description of the issue (e.g., no power, low
                      water pressure)
                    </li>
                    <li>Your contact information (phone number)</li>
                    <li>Any relevant photos</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>
                  Is there a fee to report an issue?
                </AccordionTrigger>
                <AccordionContent>
                  No, reporting an issue through our platform is completely
                  free.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>
                  How long does it take to resolve an issue?
                </AccordionTrigger>
                <AccordionContent>
                  The resolution time depends on the nature of the issue and
                  your location. You’ll receive notifications through your
                  contact number regarding progress or delays.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>
                  Will I be notified when the issue is resolved?
                </AccordionTrigger>
                <AccordionContent>
                  Yes, you’ll receive SMS notifications every time the status of
                  your report changes.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>What do moderators do?</AccordionTrigger>
                <AccordionContent>
                  Moderators manage public reports related to their assigned
                  company. They: <br />
                  <br />
                  <ul className="list-disc list-inside space-y-2">
                    <li>Review incoming reports</li>
                    <li>Assign reports to the appropriate team</li>
                    <li>Provide users with updates on their reports</li>
                    <li>Ensure reports are resolved promptly</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger>
                  How can I apply as a moderator?
                </AccordionTrigger>
                <AccordionContent>
                  If you’re interested in becoming a moderator, please email{" "}
                  <strong>
                    <a
                      href="mailto:admin@a.infrasee.com?subject=Moderator%20Application"
                      className="text-black-500 underline"
                    >
                      admin@a.infrasee.com
                    </a>
                  </strong>{" "}
                  with verification from your company. Successful applicants
                  will receive login details and further instructions.
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
