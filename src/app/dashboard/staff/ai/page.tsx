import ChatUI from "@/components/ChatUI";

export default function AIPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        AI Medicine Assistant
      </h1>

      <ChatUI />
    </div>
  );
}