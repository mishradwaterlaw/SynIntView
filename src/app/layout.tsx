// src/app/layout.tsx
import { Providers } from "@/components/providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          {/* StreamVideoProvider removed from here */}
          {children}
        </Providers>
      </body>
    </html>
  );
}