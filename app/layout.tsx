import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const assetPath = process.env.NEXTJS_PUBLIC_BASE ?? "";

export const metadata: Metadata = {
  title: "dcc-help",
  description: "A web-based C code editor with compiler output",
  icons: [
    { rel: 'icon', url: assetPath + '/logo.svg', type: 'image/svg+xml' },
    { rel: 'icon', url: assetPath + '/favicon.png', type: 'image/png' }, // png favicon just for safari
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
