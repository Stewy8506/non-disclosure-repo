import type { Metadata } from "next";
import { DM_Sans, Fira_Code, Bitcount_Prop_Single, Quicksand } from "next/font/google";
import "./globals.css";
import MenuBar from "@/components/layout/MenuBar";
import Dock from "@/components/layout/Dock";
import CustomCursor from "@/components/CustomCursor";
import DynamicBackground from "@/components/ui/DynamicBackground";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import ScrollToTop from "@/components/ui/ScrollToTop";
import HashCanonicalizer from "@/components/layout/HashCanonicalizer";
import TerminalWindow from "@/components/ui/TerminalWindow";
import ChatWindow from "@/components/ui/ChatWindow";
import KonamiCode from "@/components/ui/KonamiCode";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

const bitcount = Bitcount_Prop_Single({
  variable: "--font-bitcount",
  subsets: ["latin"],
  weight: ["100"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anuvab Das | Full Stack Developer",
  description: "Premium portfolio of a full stack developer specializing in React Native, Flutter, and Next.js",
};

export const viewport: import("next").Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${firaCode.variable} ${bitcount.variable} ${quicksand.variable} antialiased`}>
        <ClientLayoutWrapper>
          <HashCanonicalizer />
          <NoiseOverlay />
          <DynamicBackground />
          <CustomCursor />
          <TerminalWindow />
          <ChatWindow />
          <KonamiCode />
          <MenuBar />
          {children}
          <Dock />
          <ScrollToTop />
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
