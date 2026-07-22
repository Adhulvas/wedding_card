import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Montserrat, Poppins, Dancing_Script, Josefin_Sans } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-josefin-sans",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://alil-sneha.netlify.app"),

  title: "Wedding Invitation | Alilvas & Sneha",
  description: "Join us to celebrate the wedding of Alilvas & Sneha.",

  openGraph: {
    title: "Wedding Invitation | Alilvas & Sneha",
    description: "Join us to celebrate the wedding of Alilvas & Sneha.",
    url: "https://alil-sneha.netlify.app",
    type: "website",
    images: [
      {
        url: "/assets/preview.png",
        width: 1200,
        height: 630,
        alt: "Wedding Invitation",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    images: ["/assets/preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${cormorant.variable} ${montserrat.variable} ${poppins.variable} ${dancingScript.variable} ${josefinSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF6F0] text-[#2E251B] antialiased">
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
