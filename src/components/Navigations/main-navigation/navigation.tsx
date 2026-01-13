"use client"

import { useState } from "react"
import Link from "next/link"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { Menu, X } from "lucide-react"
import { useMobile } from "@/lib/hooks/use-mobile"
import { DesktopLink, MobileLink } from "./nav-link"

const NavBar = () => {
  const isMobile = useMobile()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">

        {/* Top bar */}
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-200">
                AutoCare Pro
              </h1>
              <p className="text-xs text-gray-500">
                Professional Automotive Services
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          {!isMobile && (
            <nav className="flex items-center gap-1">
              <DesktopLink href="/services" label="Services" />
              <DesktopLink href="/book" label="Book Appointment" />
              <DesktopLink href="/about" label="About Us" />
              <DesktopLink href="/contact" label="Contact" />
            </nav>
          )}

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <SignedIn>
              {!isMobile && (
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition"
                >
                  Dashboard
                </Link>
              )}
              <UserButton />
            </SignedIn>

            <SignedOut>
              {!isMobile && (
                <>
                  <Link
                    href="/sign-in"
                    className="text-gray-400 hover:text-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </SignedOut>

            {/* MOBILE TOGGLE — THIS IS WHAT YOU WERE MISSING */}
            {isMobile && (
              <button
                onClick={() => setMobileOpen(prev => !prev)}
                className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 transition"
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-white" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* MOBILE MENU PANEL */}
        {isMobile && mobileOpen && (
          <div className="mt-4 rounded-2xl border border-gray-800 bg-gray-900/95 backdrop-blur-xl p-4 space-y-2">

            <MobileLink href="/services" label="Services" onClick={() => setMobileOpen(false)} />
            <MobileLink href="/book" label="Book Appointment" onClick={() => setMobileOpen(false)} />
            <MobileLink href="/about" label="About Us" onClick={() => setMobileOpen(false)} />
            <MobileLink href="/contact" label="Contact" onClick={() => setMobileOpen(false)} />

            <SignedOut>
              <div className="pt-3 border-t border-gray-800 flex gap-2">
                <Link
                  href="/sign-in"
                  className="flex-1 text-center py-2 rounded-lg bg-gray-800 text-gray-300"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="flex-1 text-center py-2 rounded-lg bg-blue-500 text-white"
                >
                  Sign Up
                </Link>
              </div>
            </SignedOut>
          </div>
        )}
      </div>
    </header>
  )
}

export default NavBar
