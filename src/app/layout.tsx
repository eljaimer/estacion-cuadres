import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sistema de Cuadres - Estación Vista Hermosa",
  description: "Sistema automatizado de cuadres diarios para estación de servicio y tienda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased bg-gray-50">
        {children}
      </body>
    </html>
  );
}
