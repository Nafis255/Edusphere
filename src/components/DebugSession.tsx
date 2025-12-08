"use client";

import { useSession } from "next-auth/react";

export default function DebugSession() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading session...</p>;

  return (
    <div className="fixed bottom-4 left-4 z-50 p-4 bg-black/90 text-green-400 font-mono text-xs rounded-lg shadow-xl max-w-md overflow-auto border border-green-500">
      <h3 className="font-bold border-b border-green-500 mb-2 pb-1">SESSION DEBUGGER</h3>
      <p>Status: {status}</p>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}