import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
<<<<<<< HEAD
import Providers from "./providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});
=======
import Providers from './providers';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})
>>>>>>> ede13b35deb730fba2f93ad0e48fded8cf0fa73e

export const metadata: Metadata = {
  title: "Capanalytics",
  description: "Your Goto investment website",
  icons: {
<<<<<<< HEAD
    icon: "/assets/images/logo.svg", // Ensure this file exists in the 'public' directory
  },
};

=======
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
>>>>>>> ede13b35deb730fba2f93ad0e48fded8cf0fa73e

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
<<<<<<< HEAD
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
=======
        <ClerkProvider>
          <Providers>
            {children}
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  )
}
>>>>>>> ede13b35deb730fba2f93ad0e48fded8cf0fa73e
