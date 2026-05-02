import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "tr-validation Next.js example",
  description:
    "A minimal Next.js App Router integration example for @apideposu/tr-validation.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          background: "#f6f3ee",
          color: "#1f2937",
        }}
      >
        {children}
      </body>
    </html>
  );
}
