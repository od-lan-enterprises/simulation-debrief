import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppHeader } from "@/components/app-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Simulation Debrief — Session Review",
  description:
    "A flight-recorder for healthcare simulation: review a completed session from its structured events, derived facts, and AI-assisted debrief.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <TooltipProvider delay={150}>
          <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
            <AppHeader />
            <div className="mt-6">{children}</div>
            <footer className="mt-12 border-t pt-4 text-xs text-muted-foreground">
              Prototype for reviewing simulated training sessions. The
              rule-of-thumb flags are a teaching aid, not clinical guidance.
            </footer>
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
