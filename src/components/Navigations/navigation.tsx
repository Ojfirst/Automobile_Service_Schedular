import { SignedIn, SignedOut, UserButton, } from "@clerk/nextjs";
import Link from "next/link";


const NavBar = async () => {


  return (
    <header className="bg-black border-b border-gray-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section - Logo & Navigation */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 group"
            >
              <div className="p-2 bg-blue-500 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-200 group-hover:text-white transition-colors">
                  AutoCare Pro
                </h1>
                <p className="text-xs text-gray-500">Professional Automotive Services</p>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/services"
                className="px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors text-sm font-medium"
              >
                Services
              </Link>
              <Link
                href="/book"
                className="px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors text-sm font-medium"
              >
                Book Appointment
              </Link>
              <Link
                href="/about"
                className="px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors text-sm font-medium"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors text-sm font-medium"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Right Section - User Actions */}
          <div className="flex items-center gap-3">
            <SignedIn>

              {/* Dashboard Button */}
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>

              {/* User Profile Dropdown Trigger */}
              <div className="relative group">
                <button className="flex items-center bg-gray-900 gap-2 p-2 hover:bg-gray-800 rounded-lg transition-colors">

                  <UserButton />

                </button>

              </div>
            </SignedIn>
            <SignedOut>

              <div className="flex items-center gap-3">
                <Link
                  href="/sign-in"
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  )
}

export default NavBar;