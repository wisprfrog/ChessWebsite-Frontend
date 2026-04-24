import './globals.css';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { SocketProvider } from "@/context/socketMonsterProvider";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={cn("font-sans", geist.variable)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Monster Chess of Clans</title>
      </head>
      <body className="w-screen h-screen m-0 p-0 overflow-x-hidden">
        <SocketProvider>
          {children}
        </SocketProvider>
      </body>
    </html>
  );
}