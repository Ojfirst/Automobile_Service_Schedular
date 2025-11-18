'use client';

import NavBar from "@/components/Navigations/navigation";

const GlobalError = ({ error, reset }: { error: Error, reset: () => void }) => {

  return <html>
    <body>
      <NavBar />
      <div className="text-center flex justify-center items-center p-4">
        <h2 >App Error: {error.message}</h2>
        <button onClick={() => reset()}>Retry</button>
      </div>
    </body>
  </html>
}

export default GlobalError;