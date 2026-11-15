"use client";

/** Last-resort boundary when the root layout itself fails. Must render <html>. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-IN">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#fbfaf8",
          color: "#1c1917",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        <main>
          <p style={{ color: "#c2410c", letterSpacing: "0.2em", fontFamily: "monospace" }}>500</p>
          <h1 style={{ fontSize: "2rem", margin: "1rem 0" }}>Something went wrong.</h1>
          <button
            type="button"
            onClick={reset}
            style={{
              background: "#c2410c",
              color: "#fff",
              border: 0,
              borderRadius: 999,
              padding: "0.75rem 1.25rem",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
