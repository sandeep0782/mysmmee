import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LayoutWrapper from "./LayoutWrapper";
import { Assistant } from "next/font/google";

const assistant = Assistant({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-assistant", // ✅ exposes CSS variable
  display: "swap", // optional but recommended
});
export const metadata: Metadata = {
  title: "Online Shopping for Women, Men, Kids fashion & Lifestyles - Mysmme",
  description: "mysmme.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body
        className={assistant.className}
        suppressHydrationWarning
      >
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
