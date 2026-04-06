"use client";

import { useState } from "react";

export default function ManagerChatUI() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleAsk = async () => {
    const res = await fetch("/api/ai-manager", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    setResponse(data.answer);
  };

  return (
    <div className="p-6 space-y-4">
      
      <h1 className="text-2xl font-bold">AI Manager Assistant</h1>

      {/* INPUT */}
      <div className="flex gap-2">
        <input
          className="border p-3 w-full rounded-xl"
          placeholder="Ask something like: Which is the most sold medicine?"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          onClick={handleAsk}
          className="bg-blue-600 text-white px-4 rounded-xl"
        >
          Ask
        </button>
      </div>

      {/* OUTPUT */}
      <div className="bg-gray-100 p-4 rounded-xl min-h-[100px]">
        {response || "AI response will appear here..."}
      </div>

    </div>
  );
}