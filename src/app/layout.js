import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "react-hot-toast";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Ntechzy-Ems",
  description: "Generated by create ntechzy pvt. limited",

  icons: {
    icon: "/assets/ntechzylogo.png",
  },
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <AuthProvider>

        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Navbar />
          <Toaster position="bottom-right" />
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}
