'use client';

const GlobalError = ({ error, reset }: { error: Error, reset: () => void }) => {

  return <html>
    <body>
      <h2>App Error: {error.message}</h2>
      <button onClick={() => reset()}>Retry</button>
    </body>
  </html>
}

export default GlobalError;