import "./globals.css";

import Menu from "@/components/ui/menu";

export default function RootLayout({

  children,

}: {

  children: React.ReactNode;

}) {

  return (

    <html lang="en">

      <body>

        <Menu />

        {children}

      </body>

    </html>

  );

}