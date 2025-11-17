'use client';
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest: string };
  reset: () => void;
}

const Error = ({ error, reset }: ErrorProps) => {

  const route = useRouter()

  useEffect(() => {
    if (error.message.includes('Clerk') || error.message.includes('prisma')) {
      route.push('sign-in?error=network')
    }
  }, [error, route])
  return (
    <>
      <h1>Something went wrong in your dashboard</h1>
      <p>Details: {error.message}</p>

      <div>
        <button onClick={() => reset()}>Try again</button>
        <Link href={'/dashboard'}>Go back to dashboard</Link>
      </div>
    </>
  )
}

export default Error