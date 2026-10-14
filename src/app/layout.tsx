import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "PORTAL TERPADU IRODORI | JFT-Basic A2 Studio & CBT",
  description: "Platform Pembelajaran Terpadu & Simulasi Ujian JFT-Basic A2 Berstandar Irodori (The Japan Foundation)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    "pk_test_c3VpdGFibGUtYWtpdGEtMTE1Ni5jbGVyay5hY2NvdW50cy5kZXYk";

  return (
    <html lang="id">
      <body className={`${jakarta.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <ClerkProvider publishableKey={publishableKey}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
