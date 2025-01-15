import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "./providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Capanalytics",
  description: "Your Goto investment website",
  icons: {
    icon: "/assets/images/logo.svg", // Ensure this file exists in the 'public' directory
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
      <ClerkProvider
        signInUrl="/sign-in"
        signUpUrl="/sign-up"
         >
      <Providers>
    {children}
    </Providers>
   </ClerkProvider>

      </body>
    </html>
  );
}
