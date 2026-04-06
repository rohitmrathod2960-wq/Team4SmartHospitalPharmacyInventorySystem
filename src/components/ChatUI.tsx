"use client";

import { useState } from "react";

export default function ChatUI() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai-medicine", {
        method: "POST",
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      const aiMsg = {
        role: "assistant",
        content: data.reply,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setInput("");

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">

      <div className="border rounded-lg p-4 h-96 overflow-y-auto bg-white mb-4">

        {messages.length === 0 && (
          <p className="text-gray-400">
            Ask about any medicine (e.g. Paracetamol)...
          </p>
        )}

        {messages.map((msg, index) => (
          <div key={index} className="mb-3">
            <span className={msg.role === "user" ? "text-blue-600 font-bold" : "text-green-600 font-bold"}>
              {msg.role === "user" ? "You" : "AI"}:
            </span>
            <p>{msg.content}</p>
          </div>
        ))}

        {loading && <p className="text-gray-500">Typing...</p>}

      </div>

      <div className="flex gap-2">

        <input
          type="text"
          placeholder="Enter medicine name..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Send
        </button>

      </div>

    </div>
  );
}