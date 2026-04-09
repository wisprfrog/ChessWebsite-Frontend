import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Monster Chess of Clans</title>
      </head>
      <body className="w-screen h-screen m-0 p-0 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}