import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from './providers';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: "Capanalytics",
  description: "Your Goto investment website",
  icons: {
    icon:'/assets/images/logo.svg'
  }
};

if (typeof window !== 'undefined') {
  (['log', 'warn', 'error'] as const).forEach((method) => {
    const original = console[method];
    console[method] = function(...args: any[]) {
      original.apply(console, args);
      const logOutput = document.getElementById('log-output');
      if (logOutput) {
        logOutput.innerHTML += `<p>${method}: ${args.join(' ')}</p>`;
      }
    };
  });
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ClerkProvider>
          <Providers>
            {children}
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  )
}