'use client';
import Link from "next/link";

const GlobalError = ({ error, reset }: { error: Error, reset: () => void }) => {
  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100">
          <div className="max-w-xl text-center p-6">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="mb-4">{error?.message || 'An unexpected error occurred.'}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => reset()}
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Retry
              </button>
              <Link href="/" className="bg-gray-700 text-white px-4 py-2 rounded-md">Home</Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

export default GlobalError;