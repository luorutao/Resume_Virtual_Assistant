import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import ChatWidget from "@/components/ChatWidget";
import "@/styles/globals.css";
import resumeData from "@/data/resume.json";

const { personal } = resumeData;

export const metadata: Metadata = {
  metadataBase: new URL("https://rutaoluo.com"),
  title: {
    default: `${personal.name} — ${personal.title}`,
    template: `%s | ${personal.name}`,
  },
  description: `Personal website of ${personal.name}. ${personal.tagline}`,
  keywords: [
    "AI",
    "Machine Learning",
    "Data Science",
    "LLM",
    "Finance",
    "Vanguard",
    "AWS",
    personal.name,
  ],
  authors: [{ name: personal.name }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rutaoluo.com",
    title: `${personal.name} — ${personal.title}`,
    description: `Personal website of ${personal.name}. ${personal.tagline}`,
    siteName: personal.name,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${personal.name} — ${personal.title}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${personal.name} — ${personal.title}`,
    description: personal.tagline,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <ChatWidget />
          <footer className="border-t border-gray-100 dark:border-gray-800 py-8 text-center text-sm text-gray-400 dark:text-gray-600">
            <p>
              © {new Date().getFullYear()} {personal.name}. Built with Next.js
              &amp; Tailwind CSS.
            </p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
