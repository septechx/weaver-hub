import { Geist, Geist_Mono } from "next/font/google";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NavBar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import QueryClientProvider from "@/components/queryClientProvider";
import type { Metadata } from "next";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Weaver",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <NavBar />
            {children}
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
