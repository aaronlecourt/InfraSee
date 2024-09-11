import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area"; // Adjust the import path based on your project structure

const TermsAndConditions = () => {
  return (
    <ScrollArea className="h-[80vh] w-full max-w-4xl mx-auto rounded-md pr-4 pl-1">
      <h2 className="text-md font-semibold mb-2 text-primary">
        1. Introduction
      </h2>
      <p className="mb-4 font-normal text-primary">
        Welcome to InfraSee (“we,” “our,” “us”). These Terms and Conditions
        (“Terms”) govern your use of our website [infrasee.com] and the services
        we provide related to infrastructure reporting and management. By
        accessing or using our website and services, you agree to comply with
        and be bound by these Terms. If you do not agree to these Terms, please
        do not use our website or services.
      </p>

      <h2 className="text-md font-semibold mb-2 text-primary">
        2. Changes to These Terms
      </h2>
      <p className="mb-4 font-normal text-primary">
        We may update these Terms from time to time. We will notify you of any
        changes by posting the updated Terms on our website. Your continued use
        of our website or services after any changes have been made will
        constitute your acceptance of the revised Terms.
      </p>

      <h2 className="text-md font-semibold mb-2 text-primary">
        3. Use of Our Services
      </h2>
      <ul className="list-disc pl-5 mb-4 font-normal text-primary">
        <li>
          <strong>Eligibility:</strong> You must be at least 18 years old to use
          our services. By using our services, you represent and warrant that
          you meet this eligibility requirement.
        </li>
        <li>
          <strong>Account Registration:</strong> To access certain features of
          our services, you may need to create an account. You agree to provide
          accurate, complete, and current information and to update your
          information as necessary.
        </li>
        <li>
          <strong>Prohibited Activities:</strong> You agree not to engage in any
          illegal, harmful, or disruptive activities, including but not limited
          to unauthorized access to our systems, transmission of malicious
          software, or infringement of intellectual property rights.
        </li>
      </ul>

      <h2 className="text-md font-semibold mb-2 text-primary">
        4. Intellectual Property
      </h2>
      <ul className="list-disc pl-5 mb-4 font-normal text-primary">
        <li>
          <strong>Ownership:</strong> All content, trademarks, and other
          intellectual property on our website and in our services are owned by
          or licensed to InfraSee. You may not use, reproduce, or distribute any
          content without our explicit permission.
        </li>
        <li>
          <strong>User Content:</strong> By submitting content to us, you grant
          InfraSee a worldwide, non-exclusive, royalty-free license to use,
          display, and distribute your content in connection with our services.
        </li>
      </ul>

      <h2 className="text-md font-semibold mb-2 text-primary">5. Privacy</h2>
      <p className="mb-4 font-normal text-primary">
        Your use of our services is also governed by our Privacy Policy, which
        can be reviewed at [link to Privacy Policy]. Please review the Privacy
        Policy to understand how we collect, use, and protect your information.
      </p>

      <h2 className="text-md font-semibold mb-2 text-primary">
        6. Disclaimer of Warranties
      </h2>
      <p className="mb-4 font-normal text-primary">
        Our website and services are provided “as is” and “as available” without
        warranties of any kind. InfraSee does not guarantee that our website or
        services will be uninterrupted or error-free. Your use of our website
        and services is at your own risk.
      </p>

      <h2 className="text-md font-semibold mb-2 text-primary">
        7. Limitation of Liability
      </h2>
      <p className="mb-4 font-normal text-primary">
        To the fullest extent permitted by law, InfraSee shall not be liable for
        any indirect, incidental, special, consequential, or punitive damages
        arising from or related to your use of our website or services. Our
        total liability to you for any claim arising from these Terms shall not
        exceed [maximum amount].
      </p>

      <h2 className="text-md font-semibold mb-2 text-primary">
        8. Indemnification
      </h2>
      <p className="mb-4 font-normal text-primary">
        You agree to indemnify and hold harmless InfraSee, its affiliates,
        officers, employees, and agents from and against any claims,
        liabilities, damages, losses, or expenses arising out of your use of our
        website or services or your violation of these Terms.
      </p>

      <h2 className="text-md font-semibold mb-2 text-primary">
        9. Termination
      </h2>
      <p className="mb-4 font-normal text-primary">
        We reserve the right to terminate or suspend your access to our website
        or services at our sole discretion, without prior notice, for any reason
        including, but not limited to, your violation of these Terms.
      </p>

      <h2 className="text-md font-semibold mb-2 text-primary">
        10. Governing Law
      </h2>
      <p className="mb-4 font-normal text-primary">
        These Terms shall be governed by and construed in accordance with the
        laws of [Your Jurisdiction]. Any disputes arising from these Terms shall
        be resolved in the courts located in [Your Jurisdiction].
      </p>

      <h2 className="text-md font-semibold mb-2 text-primary">
        11. Contact Us
      </h2>
      <p className="mb-4 font-normal text-primary">
        If you have any questions about these Terms or our services, please
        contact us at:
      </p>
      <p className="text-primary font-normal">
        InfraSee
        <br />
        [Address]
        <br />
        [Email Address]
        <br />
        [Phone Number]
      </p>
      <br />

      <h2 className="text-md font-semibold mb-2 text-primary">
        12. Miscellaneous
      </h2>
      <ul className="list-disc pl-5 mb-4 font-normal text-primary">
        <li>
          <strong>Entire Agreement:</strong> These Terms constitute the entire
          agreement between you and InfraSee regarding your use of our website
          and services and supersede all prior agreements and understandings.
        </li>
        <li>
          <strong>Severability:</strong> If any provision of these Terms is
          found to be invalid or unenforceable, the remaining provisions will
          continue in full force and effect.
        </li>
        <li>
          <strong>Waiver:</strong> Our failure to enforce any right or provision
          of these Terms shall not be deemed a waiver of such right or
          provision.
        </li>
      </ul>
    </ScrollArea>
  );
};

export default TermsAndConditions;
