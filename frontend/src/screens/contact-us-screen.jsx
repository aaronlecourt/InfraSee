import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Mail, Phone, Building } from "lucide-react";

function ContactUsScreen() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <HelmetProvider>
      <div className="bg-[url('../bg.jpg')] bg-cover bg-no-repeat bg-bottom min-h-screen flex flex-col overflow-hidden">
        <Helmet>
          <title>{"InfraSee | Contact Us"}</title>
        </Helmet>
        <header className="w-full h-fit p-3 flex items-center justify-between border-b border-slate-400">
          <div className="w-[6rem] mt-1 cursor-pointer" onClick={handleLogoClick}>
            <img src="/infrasee_black.png" alt="Infrasee Logomark" />
          </div>
          <Button onClick={handleBackClick} variant="ghost">
            Back
          </Button>
        </header>

        <main className="px-10 py-5 m-auto flex-col lg:w-2/5 md:px-8">
          <section className="bg-white rounded-md p-5 shadow-sm">
            <h2 className="text-2xl font-bold leading-none">Contact Details</h2>
            <p className="text-sm text-muted-foreground mt-3">
              If you have any questions, please reach out to us using the details below.
            </p>
            <div className="mt-4">
              <p className="font-medium flex gap-2 items-center"><Mail size={16}/>Email us at</p>
              <Button variant="link" as="span">
                <a href="mailto:i.iirs.infrasee@gmail.com" className="text-blue-600">
                  i.iirs.infrasee@gmail.com
                </a>
              </Button>
            </div>
            <div className="mt-2">
              <p className="font-medium flex gap-2 items-center"><Phone size={16}/>Contact us at</p>
              <Button variant="link" as="span">
                <a href="tel:+11234567890" className="text-blue-600">
                  (123) 456-7890
                </a>
              </Button>
            </div>
            <div className="mt-2">
              <p className="font-medium flex gap-2 items-center"><Building size={16}/>Go to our Address</p>
              <Button variant="link" as="span">
                <a className="text-blue-600">
                  123 Infrastructure St., City, Country
                </a>
              </Button>
            </div>
          </section>
        </main>
      </div>
    </HelmetProvider>
  );
}

export default ContactUsScreen;
