import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

export function MessagesPage({
  onEnterConversation,
}: {
  onEnterConversation: (conversationId: Id<"conversations">) => void;
}) {
  const conversations = useQuery(api.messages.listConversations);

  return (
    <div className="p-4">
      <div className="space-y-4">
        <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
          <i className="fas fa-headset text-purple-600 text-xl"></i>
          <span className="mr-4 font-semibold">خدمة العملاء</span>
        </div>
        <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
          <i className="fas fa-bell text-purple-600 text-xl"></i>
          <span className="mr-4 font-semibold">رسائل النظام</span>
        </div>
      </div>
      <div className="mt-6">
        {conversations?.map((conversation) => (
          <div
            key={conversation._id}
            onClick={() => onEnterConversation(conversation._id)}
            className="flex items-center p-3 bg-white rounded-lg shadow-sm mb-2 cursor-pointer hover:bg-purple-50"
          >
            <img
              src={
                conversation.otherUser?.image ??
                `https://ui-avatars.com/api/?name=${conversation.otherUser?.name}`
              }
              alt={conversation.otherUser?.name}
              className="w-12 h-12 rounded-full"
            />
            <div className="mr-4">
              <div className="font-bold">{conversation.otherUser?.name}</div>
              <div className="text-sm text-gray-500 truncate">
                {conversation.lastMessage?.text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
