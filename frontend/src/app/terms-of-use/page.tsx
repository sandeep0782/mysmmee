import React from "react";

export default function TermsOfUse() {
  return (
    <main style={styles.container}>
      <h1 style={styles.title}>MYSMME MYNTRA – Terms of Use</h1>
      <p style={styles.meta}>Last Updated: 29 September 2025 | Version 3.0</p>

      <Section title="Disclaimer">
        <p>
          Any translations of these Terms are generated using automated tools.
          In case of inconsistency, the English version shall prevail.
        </p>
      </Section>

      <Section title="Introduction">
        <p>
          This Terms of Use document is an electronic record governed by the
          Information Technology Act, 2000 and applicable rules. It governs
          access to and use of the MYSMME MYNTRA platform.
        </p>
        <p>
          The platform is owned and operated by Myntra Designs Private Limited,
          with registered offices in Bengaluru and Gurugram, India.
        </p>
        <p>
          By accessing or using the platform, you enter into a binding legal
          agreement with Myntra Designs Private Limited.
        </p>
      </Section>

      <Section title="1. Definitions">
        <p>
          “User”, “You” or “Your” refers to any individual or entity using the
          platform. “Myntra”, “We”, “Us” or “Our” refers to Myntra Designs
          Private Limited and its affiliates.
        </p>
      </Section>

      <Section title="2. Acceptance of Terms">
        <p>
          Continued access or use of the platform constitutes acceptance of
          these Terms, along with all referenced policies including the Privacy
          Policy.
        </p>
        <p>
          Myntra reserves the right to modify these Terms at any time without
          prior notice. Continued use implies acceptance of updated Terms.
        </p>
      </Section>

      <Section title="3. User Account, Credentials & Security">
        <ul>
          <li>You are responsible for safeguarding your login credentials.</li>
          <li>
            Myntra may suspend or terminate accounts with inaccurate,
            misleading, or incomplete information.
          </li>
          <li>
            Your registered mobile number is treated as the primary identifier.
          </li>
          <li>
            You must immediately notify Myntra of unauthorized account access.
          </li>
          <li>
            Accounts inactive for two (2) years may have associated data
            permanently deleted.
          </li>
        </ul>
      </Section>

      <Section title="4. Services Provided">
        <p>
          Myntra provides an online marketplace enabling users to browse and
          purchase fashion and lifestyle products from independent sellers.
        </p>
        <p>
          Product sales are governed by return, exchange, and cancellation
          policies published on the platform.
        </p>
      </Section>

      <Section title="5. Accuracy of Information">
        <p>
          Myntra does not guarantee the accuracy, completeness, or reliability
          of product descriptions or content provided by sellers.
        </p>
      </Section>

      <Section title="6. Marketplace Role">
        <p>
          Myntra is a facilitator only and is not a party to transactions
          between buyers and sellers. All sales contracts are strictly between
          buyers and sellers.
        </p>
      </Section>

      <Section title="7. Pricing & Order Cancellation">
        <p>
          Pricing errors may occur due to technical issues. Sellers reserve
          the right to cancel orders affected by incorrect pricing.
        </p>
      </Section>

      <Section title="8. User Conduct">
        <p>Users must not upload or share content that:</p>
        <ul>
          <li>Is unlawful, harmful, obscene, defamatory, or misleading</li>
          <li>Infringes intellectual property or privacy rights</li>
          <li>Promotes fraud, gambling, or illegal activity</li>
          <li>Contains malware or attempts unauthorized access</li>
        </ul>
      </Section>

      <Section title="9. Fraud Prevention">
        <p>
          Myntra reserves the right to classify accounts as fraudulent based on
          excessive returns, payment abuse, voucher misuse, or false identity
          usage.
        </p>
      </Section>

      <Section title="10. Bulk & Commercial Orders">
        <p>
          Orders intended for resale or commercial use may be cancelled at
          Myntra’s discretion. Business-to-business transactions are not
          supported.
        </p>
      </Section>

      <Section title="11. User-Generated Content">
        <p>
          Content posted by users may be used by Myntra for promotional or
          business purposes without compensation, subject to applicable laws.
        </p>
      </Section>

      <Section title="12. AI-Based Features">
        <p>
          AI-generated content such as reviews or tags may contain inaccuracies.
          Users should exercise discretion.
        </p>
      </Section>

      <Section title="13. Return & Exchange Policy">
        <p>
          Products must be unused and returned with original tags. Items failing
          quality checks may be returned without refund.
        </p>
      </Section>

      <Section title="14. Payments">
        <p>
          Payments are processed in Indian Rupees only. Myntra acts solely as a
          payment facilitator and is not a banking institution.
        </p>
      </Section>

      <Section title="15. Refunds">
        <p>
          Refunds are subject to policy compliance and will be processed through
          the original payment method where applicable.
        </p>
      </Section>

      <Section title="16. Compliance with Law">
        <p>
          Users agree to comply with all applicable Indian laws including tax,
          foreign exchange, and data protection regulations.
        </p>
      </Section>

      <Section title="17. Intellectual Property">
        <p>
          All platform content is protected by intellectual property laws and
          may not be reproduced without prior written consent.
        </p>
      </Section>

      <Section title="18. Limitation of Liability">
        <p>
          Myntra shall not be liable for indirect, incidental, or consequential
          damages. Liability is limited to the value of products purchased.
        </p>
      </Section>

      <Section title="19. Termination">
        <p>
          Myntra may suspend or terminate accounts for violation of these Terms
          without prior notice.
        </p>
      </Section>

      <Section title="20. Jurisdiction">
        <p>
          These Terms are governed by Indian law. All disputes shall be subject
          to the exclusive jurisdiction of courts in Bengaluru.
        </p>
      </Section>

      <Section title="21. Grievance Redressal">
        <p>
          Grievance Officer: Mr. Arshwaal Singh<br />
          Email: customergrievance@myntra.com<br />
          Phone: 080-61561999
        </p>
      </Section>

      <Section title="22. Delivery & Logistics">
        <p>
          Delivery timelines are estimates. Ownership transfers upon handover
          to logistics partners.
        </p>
      </Section>

      <Section title="23. Alteration Services">
        <p>
          Alteration services are optional, non-refundable, and availed at the
          user’s own risk.
        </p>
      </Section>

      <Section title="24. Platform Fees & Charges">
        <p>
          Platform and logistics charges may apply and are displayed prior to
          order confirmation.
        </p>
      </Section>

      <footer style={styles.footer}>
        © {new Date().getFullYear()} MYSMME MYNTRA. All rights reserved.
      </footer>
    </main>
  );
}

function Section({ title, children }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <div style={styles.text}>{children}</div>
    </section>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
    lineHeight: 1.6,
  },
  title: { fontSize: "28px", marginBottom: "4px" },
  meta: { fontSize: "12px", color: "#666", marginBottom: "24px" },
  section: { marginBottom: "24px" },
  sectionTitle: { fontSize: "18px", marginBottom: "8px" },
  text: { fontSize: "14px" },
  footer: {
    marginTop: "40px",
    fontSize: "12px",
    color: "#666",
    textAlign: "center",
  },
};
