import React from "react";

const TermsOfUsePage = () => {
  return (
    <div className="container text-sm max-w-4xl mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">
        Terms of Use – MYSMME MYNTRA
      </h1>

      <p className="mb-6">
        <strong>Last updated: September 29, 2025 | Version 3.0</strong>
      </p>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Disclaimer</h2>
        <p>
          Any translations of these Terms of Use are generated using automated
          tools. In the event of any conflict or inconsistency, the English
          version shall prevail.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">1. Introduction</h2>
        <p className="mb-4">
          These Terms of Use constitute an electronic record in accordance with
          the Information Technology Act, 2000 and applicable rules made
          thereunder.
        </p>
        <p className="mb-4">
          The Platform is operated by MYSMME MYNTRA Private Limited (“MYSMME”,
          “we”, “us”, “our”). By accessing or using the Platform, you agree to be
          bound by these Terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">2. Acceptance of Terms</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            Your access or use of the Platform constitutes acceptance of these
            Terms and related policies.
          </li>
          <li>
            We may modify these Terms at any time. Continued use indicates
            acceptance of the revised Terms.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">
          3. User Account & Security
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            You are responsible for maintaining the confidentiality of your
            login credentials.
          </li>
          <li>
            The registered mobile number shall be treated as the primary account
            identifier.
          </li>
          <li>
            You must notify us immediately of any unauthorized access or breach
            of security.
          </li>
          <li>
            Accounts inactive for a continuous period of two (2) years may be
            deleted.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">4. Platform Services</h2>
        <p className="mb-4">
          The Platform operates as an online marketplace facilitating the sale
          of products by independent sellers to users.
        </p>
        <p className="mb-4">
          MYSMME is not a party to transactions between buyers and sellers and
          does not assume responsibility for such contracts.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">5. Pricing & Orders</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            Prices may be subject to errors due to technical issues or human
            oversight.
          </li>
          <li>
            Orders may be cancelled in case of incorrect pricing or stock
            unavailability.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">6. User Conduct</h2>
        <p className="mb-4">You agree not to upload or transmit content that:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Is unlawful, misleading, abusive, defamatory, or obscene</li>
          <li>Violates intellectual property or privacy rights</li>
          <li>Promotes fraud, gambling, or illegal activities</li>
          <li>Introduces malware or disrupts Platform security</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">7. Fraud & Abuse</h2>
        <p>
          We reserve the right to suspend or terminate accounts engaged in
          fraudulent activity, misuse of promotions, or excessive returns.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">
          8. Returns, Refunds & Cancellations
        </h2>
        <p>
          All returns, refunds, and cancellations are governed by policies
          published on the Platform and are subject to quality checks.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">9. Payments</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>All payments are processed in Indian Rupees.</li>
          <li>
            MYSMME acts solely as a payment facilitator and is not a banking
            entity.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">
          10. Intellectual Property
        </h2>
        <p>
          All content available on the Platform is protected under applicable
          intellectual property laws and may not be used without prior written
          permission.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">
          11. Limitation of Liability
        </h2>
        <p>
          To the maximum extent permitted by law, MYSMME shall not be liable for
          indirect, incidental, or consequential damages. Liability shall be
          limited to the value of the product purchased.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">12. Termination</h2>
        <p>
          We may suspend or terminate access to the Platform without prior
          notice in case of violation of these Terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">
          13. Governing Law & Jurisdiction
        </h2>
        <p>
          These Terms shall be governed by the laws of India. All disputes shall
          be subject to the exclusive jurisdiction of courts in Bengaluru,
          Karnataka.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">14. Grievance Redressal</h2>
        <p>
          <strong>Name:</strong> Mr. Krishan Chander
          <br />
          <strong>Designation:</strong> Manager – Customer Experience
          <br />
          <strong>Email:</strong> grievance@mysmme.com
          <br />
          <strong>Phone:</strong> +91-80-00000000
          <br />
          <strong>Office Hours:</strong> Monday – Friday (9:00 AM – 6:00 PM)
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">15. Contact Us</h2>
        <p>
          For questions regarding these Terms of Use, please contact us at{" "}
          <strong>support@mysmme.com</strong>.
        </p>
      </section>
    </div>
  );
};

export default TermsOfUsePage;
