import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Doc, Id } from "../convex/_generated/dataModel";
import { FormEvent, useEffect, useRef, useState } from "react";

export function ConversationPage({
  conversationId: initialConversationId,
  partnerId,
  onBack,
}: {
  conversationId?: Id<"conversations"> | null;
  partnerId?: Id<"users"> | null;
  onBack: () => void;
}) {
  const [conversationId, setConversationId] = useState(
    initialConversationId ?? null
  );
  const createConversation = useMutation(api.messages.createConversation);
  const sendMessage = useMutation(api.messages.send);

  useEffect(() => {
    if (!conversationId && partnerId) {
      const create = async () => {
        const id = await createConversation({ participantId: partnerId });
        setConversationId(id);
      };
      create();
    }
  }, [conversationId, partnerId, createConversation]);

  const messages = useQuery(
    api.messages.list,
    conversationId ? { conversationId } : "skip"
  );
  const partnerProfile = useQuery(
    api.users.getProfile,
    partnerId ? { userId: partnerId } : "skip"
  );
  const currentUser = useQuery(api.users.getUserProfile);

  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() !== "" && conversationId) {
      await sendMessage({ conversationId, text: newMessage });
      setNewMessage("");
    }
  };

  if (!currentUser || (partnerId && !partnerProfile)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-700"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-purple-50 text-gray-800">
      <header className="flex items-center justify-between p-2 bg-white shadow-md">
        <button onClick={onBack} className="text-purple-600">
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1 className="font-bold text-lg text-purple-800">
          {partnerProfile?.name}
        </h1>
        <div className="w-8"></div>
      </header>

      <div ref={chatContainerRef} className="flex-grow p-2 overflow-y-auto">
        {messages?.map((message: Doc<"privateMessages">) => (
          <div
            key={message._id}
            className={`flex items-start gap-2 my-2 ${
              message.authorId === currentUser.userId ? "justify-end" : ""
            }`}
          >
            <div
              className={`p-2 rounded-lg shadow-sm ${
                message.authorId === currentUser.userId
                  ? "bg-purple-600 text-white"
                  : "bg-white"
              }`}
            >
              <p>{message.text}</p>
            </div>
          </div>
        ))}
      </div>

      <footer className="p-2 bg-white shadow-t-md">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="اكتب رسالتك..."
            className="flex-grow p-2 rounded-full border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded-full font-semibold"
          >
            إرسال
          </button>
        </form>
      </footer>
    </div>
  );
}
