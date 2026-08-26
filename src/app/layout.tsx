import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

/* Fraunces carries an optical-size axis, which lets one family serve both a
   large editorial headline and a small label without the headline looking like
   inflated body copy. Inter handles every UI surface. */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Don Julius — Hotel · Pool Club · Sports Bar",
    template: "%s · Don Julius",
  },
  description:
    "Propuesta de sitio de reservas y sistema de gestión hotelera para Don Julius, David, Chiriquí, Panamá.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
