import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Doc, Id } from "../convex/_generated/dataModel";
import { useState } from "react";

type SeatedUser = NonNullable<
  NonNullable<ReturnType<typeof useQuery<typeof api.rooms.get>>>["seats"]
>[number];

export function GiftPanel({
  roomId,
  onClose,
  seatedUsers,
}: {
  roomId: Id<"rooms">;
  onClose: () => void;
  seatedUsers: NonNullable<SeatedUser>[];
}) {
  const gifts = useQuery(api.gifts.list) ?? [];
  const sendGift = useMutation(api.chat.sendGift);
  const [selectedGift, setSelectedGift] = useState<Id<"gifts"> | null>(null);
  const [selectedUser, setSelectedUser] = useState<Id<"users"> | "all">("all");

  const handleSendGift = async () => {
    if (!selectedGift) return;
    await sendGift({
      roomId,
      giftId: selectedGift,
      recipientId: selectedUser === "all" ? undefined : selectedUser,
    });
    onClose();
  };

  return (
    <div className="absolute bottom-16 left-0 right-0 bg-purple-200 p-4 rounded-t-lg z-20">
      <h3 className="font-bold text-center mb-2 text-purple-800">إرسال هدية</h3>
      <div className="grid grid-cols-4 gap-2 mb-2 max-h-40 overflow-y-auto">
        {gifts.map((gift) => (
          <button
            key={gift._id}
            onClick={() => setSelectedGift(gift._id)}
            className={`p-1 rounded-lg ${
              selectedGift === gift._id ? "bg-purple-400 ring-2 ring-purple-600" : "bg-white"
            }`}
          >
            <img
              src={gift.url}
              alt={gift.name}
              className="w-12 h-12 mx-auto"
            />
            <p className="text-xs text-center text-purple-900">{gift.price} عملة</p>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 mb-2">
        <label className="font-semibold text-purple-800">إلى:</label>
        <select
          value={selectedUser}
          onChange={(e) =>
            setSelectedUser(e.target.value as Id<"users"> | "all")
          }
          className="flex-grow p-1 rounded border border-purple-400"
        >
          <option value="all">الجميع</option>
          {seatedUsers.map(
            (user) =>
              user && (
                <option key={user.userId} value={user.userId}>
                  {user.name}
                </option>
              )
          )}
        </select>
      </div>
      <div className="flex justify-around">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded bg-gray-300 font-semibold"
        >
          إلغاء
        </button>
        <button
          onClick={handleSendGift}
          disabled={!selectedGift}
          className="px-4 py-2 rounded bg-purple-600 text-white font-semibold disabled:bg-gray-400"
        >
          إرسال
        </button>
      </div>
    </div>
  );
}
