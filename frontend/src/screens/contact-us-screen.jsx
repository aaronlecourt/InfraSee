import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

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
          <div
            className="w-[6rem] mt-1 cursor-pointer"
            onClick={handleLogoClick}
          >
            <img src="/infrasee_black.png" alt="Infrasee Logomark" />
          </div>
          <Button onClick={handleBackClick} variant="ghost">
            Back
          </Button>
        </header>

        <main className="px-10 py-5 flex-col lg:w-2/5 md:px-8">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="text-base text-slate-500 mt-3">
            If you have any questions, please reach out to us using the details below.
          </p>

          <section className="mt-5 bg-white/30 rounded-md p-4">
            <h2 className="text-2xl font-semibold">Contact Details</h2>
            <div className="mt-4">
              <p className="font-medium">Email:</p>
              <a href="mailto:i.iirs.infrasee@gmail.com" className="text-blue-600">
                i.iirs.infrasee@gmail.com
              </a>
            </div>
            <div className="mt-2">
              <p className="font-medium">Phone:</p>
              <p className="text-blue-600">(123) 456-7890</p>
            </div>
            <div className="mt-2">
              <p className="font-medium">Address:</p>
              <p className="text-blue-600">123 Infrastructure St., City, Country</p>
            </div>
          </section>
        </main>
      </div>
    </HelmetProvider>
  );
}

export default ContactUsScreen;
