import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Public Directory",
  description: "A delightful, public, and open-source social media directory",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-7WYWX5KBTZ" />
      <body className={inter.className}>{children}</body>
    </html>
  )
}
