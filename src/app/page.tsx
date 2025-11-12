import Link from 'next/link'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-16">
          <h1 className="text-2xl font-bold text-gray-900">AutoCare Scheduler</h1>
          <div className="flex items-center gap-4">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-gray-700 hover:text-gray-900 font-medium">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AutoCare Scheduler
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Book your automobile service appointments quickly and easily.
            From oil changes to major repairs, we&apos;ve got you covered.
          </p>
          <div className="space-x-4">
            <SignedOut>
              <Link
                href="/sign-up"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Go to Dashboard
              </Link>
            </SignedIn>
            <Link
              href="/services"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              View Services
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}