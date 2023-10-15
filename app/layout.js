import "./globals.css";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "CryptoCares",
  description: "Decentralized Charity System using the XRPL",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="">
      <body suppressHydrationWarning={true} className={`${montserrat.className} bg-gradient-to-b from-[#071417] via-[#1A3E40] to-[#133E3F] bg-no-repeat text-whitish`}>
        {children}
      </body>
    </html>
  );
}
