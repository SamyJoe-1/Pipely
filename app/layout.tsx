import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Forma — 3D Agent",
  description:
    "A conversational agent for 3D production: retopology, UV unwrapping, auto-rigging, sketch-to-CAD and mesh repair.",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- root layout is the App Router equivalent of _document */}
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0b0a08] font-sans text-stone-200 antialiased">
        {children}
      </body>
    </html>
  )
}
