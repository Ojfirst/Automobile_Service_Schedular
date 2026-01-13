import Link from 'next/link'
import { SignedIn, SignedOut, } from '@clerk/nextjs'

export default async function Home() {


  return (
    <main className="min-h-screen bg-black pt-20">
      <div className="text-center pt-10">
        <h1 className="text-5xl font-bold text-gray-200 mb-6">
          AutoCare Scheduler
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Book your automobile service appointments quickly and easily.
          From oil changes to major repairs, we&apos;ve got you covered.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 m-8 space-x-4">
          <SignedOut>
            <Link
              href={"/sign-in"}
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
            href="/service"
            className="border border-gray-300 text-gray-400 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 hover:text-gray-900 hover:border-gray-500 transition"
          >
            View Services
          </Link>
        </div>
      </div>
    </main >
  )
}