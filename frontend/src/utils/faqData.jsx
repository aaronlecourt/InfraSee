import { Download, Edit, LocateFixed } from "lucide-react";
import { Button } from "@/components/ui/button";

const questions = [
  {
    question: "How do I report an issue?",
    answer: (
      <div className="flex flex-col gap-3">
        <div className="flex gap-2 items-center">
          <div className="align-middle">
            You can start making a report by clicking on
            <span className="inline-flex items-center gap-1 text-white text-nowrap px-2 py-[0.12rem] mx-1 text-[0.6rem] bg-primary rounded-sm">
              Make a Report
            </span>
            button to get redirected to the reporting page.
          </div>
        </div>
        <div className="pl-4 flex flex-col gap-3">
          <div className="flex gap-2 items-center">
            <span>➊</span>
            <div className="align-middle">
              Press on the
              <span className="inline-flex items-center gap-1 text-white text-nowrap px-2 py-[0.12rem] mx-1 text-[0.6rem] bg-primary rounded-sm">
                <Edit size={10} />
                File a Report
              </span>
              button.
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <span>➋</span>
            <div className="align-middle">
              Select a landmark by searching or manually clicking it on the map,
              or use your exact location by clicking on
              <span className="inline-flex items-center gap-1 text-nowrap px-2 py-[0.12rem] mx-1 text-[0.6rem] bg-white border rounded-sm">
                <LocateFixed size={10} />
                Use my Current Location
              </span>
              . Press on{" "}
              <span className="inline-flex items-center gap-1 text-white text-nowrap px-2 py-[0.12rem] mx-1 text-[0.6rem] bg-primary rounded-sm">
                Next
              </span>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <span>➌</span>
            <div className="align-middle">
              Select the appropriate Infrastructure Type. Press on{" "}
              <span className="inline-flex items-center gap-1 text-white text-nowrap px-2 py-[0.12rem] mx-1 text-[0.6rem] bg-primary rounded-sm">
                Next
              </span>
              .
            </div>
          </div>
          <div className="flex gap-2 items-start">
            <span>➍</span>
            <div className="align-middle">
              Provide the required details, including your full name, a brief
              description of the problem, a relevant image, and your contact
              number. Press on{" "}
              <span className="inline-flex items-center gap-1 text-white text-nowrap px-2 py-[0.12rem] mx-1 text-[0.6rem] bg-primary rounded-sm">
                Submit
              </span>
              .
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="align-middle">
            Once submitted, your report will be forwarded to the moderators
            under that infrastructure category.
            <br />
            Your report will be marked 'Unassigned' until the most suitable
            utility provider takes responsibility for resolving the issue. You
            will receive updates via SMS as your issue is being addressed.
          </div>
        </div>
      </div>
    ),
  },
  {
    question: "What information do I need to provide when reporting an issue?",
    answer: (
      <div className="flex flex-col gap-3">
        <div className="flex gap-2 items-center">
          <div className="align-middle">
            When reporting an issue, please ensure you provide the following information:
          </div>
        </div>
        <div className="pl-4 flex flex-col gap-3">
          <div className="flex gap-2 items-center">
            <span>➊</span>
            <div className="align-middle">
              <span className="inline-flex items-center gap-1 border-muted-foreground border text-nowrap px-2 py-[0.12rem] mx-1 text-xs font-semibold rounded-sm">
                Location
              </span>
              Specify a landmark or your current location. Make sure to include specifics in the report description.
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <span>➋</span>
            <div className="align-middle">
              <span className="inline-flex items-center gap-1 border-muted-foreground border text-nowrap px-2 py-[0.12rem] mx-1 text-xs font-semibold rounded-sm">
                Infrastructure Type
              </span>
              Select the relevant type of infrastructure.
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <span>➌</span>
            <div className="align-middle">
              <span className="inline-flex items-center gap-1 border-muted-foreground border text-nowrap px-2 py-[0.12rem] mx-1 text-xs font-semibold rounded-sm">
                Details
              </span>
              Include your full name, contact information, and a detailed description of the issue.
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <span>➍</span>
            <div className="align-middle">
              <span className="inline-flex items-center gap-1 border-muted-foreground border text-nowrap px-2 py-[0.12rem] mx-1 text-xs font-semibold rounded-sm">
                Image
              </span>
              Attach an image of the issue to support your report.
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="align-middle">
          Accurate and complete information is crucial for the effective processing of your report. Incomplete or inaccurate submissions may result in delays or dismissal of your report.
          </div>
        </div>
      </div>
    ),
  },
  {
    question: "Is there a fee to report an issue?",
    answer: (
      <div>No, reporting an issue through our website is free of charge.</div>
    ),
  },
  {
    question: "How long does it take to resolve an issue?",
    answer: (
      <div>
        Resolution times vary depending on the nature of the issue and your
        location. You will be notified of any updates or delays through your
        contact number.
      </div>
    ),
  },
  {
    question: "Will I be notified when the issue is fixed?",
    answer: (
      <div>
        Yes, you will receive a notification via SMS every time there is a
        change of status in your report.
      </div>
    ),
  },
  {
    question: "What do moderators do?",
    answer: (
      <div>
        Moderators are responsible for managing reports related to their
        company. They monitor and verify report credibility, provide
        updates to users about the status of their reports, and ensure that
        reports are addressed promptly.
      </div>
    ),
  },
  {
    question: "How can we apply as moderators?",
    answer: (
      <div className="flex flex-col gap-2">
        <div>
          To become a moderator, an individual must first be employed by an existing, registered utility provider company. They are then required to download and complete the PDF form below, then submit the filled copy to <b>i.iirs.infrasee@gmail.com</b>. An email will be sent upon request verification and account creation.
        </div>
        <Button 
          variant="ghost" 
          className="flex gap-2 border-muted-foreground border-dashed border" 
          onClick={() => {
            const link = document.createElement('a');
            link.href = '/infrasee_registration_form.pdf';
            link.download = 'INFRASEE_Registration_Form.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          <Download size={15} />
          Download Registration Form
        </Button>
      </div>
    ),
  },
];

export default questions;
