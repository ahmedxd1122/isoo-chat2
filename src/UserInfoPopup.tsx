import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { useState } from "react";

export function UserInfoPopup({
  targetUserId,
  roomId,
  onClose,
}: {
  targetUserId: Id<"users">;
  roomId: Id<"rooms">;
  onClose: () => void;
}) {
  const targetUser = useQuery(api.users.getUserPopupInfo, {
    userId: targetUserId,
  });
  const room = useQuery(api.rooms.get, { id: roomId });
  const currentUser = useQuery(api.users.getUserProfile);

  const follow = useMutation(api.users.follow);
  const unfollow = useMutation(api.users.unfollow);
  const appointAdmin = useMutation(api.rooms.appointAdmin);
  const removeAdmin = useMutation(api.rooms.removeAdmin);
  const kickUser = useMutation(api.rooms.kickUser);
  const banUser = useMutation(api.rooms.banUser);

  const [banDuration, setBanDuration] = useState(60); // Default 1 hour

  if (!targetUser || !room || !currentUser) return null;

  const isSelf = currentUser.userId === targetUserId;
  const isOwner = room.ownerId === currentUser.userId;
  const isAdmin = room.admins?.includes(currentUser.userId) ?? false;
  const isTargetAdmin = room.admins?.includes(targetUserId) ?? false;
  const isTargetOwner = room.ownerId === targetUserId;

  const canManage = (isOwner || isAdmin) && !isTargetOwner;

  const handleBan = () => {
    banUser({ roomId, userId: targetUserId, durationMinutes: banDuration });
    onClose();
  };

  const handleKick = () => {
    kickUser({ roomId, userId: targetUserId });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-4 w-80 text-center text-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={
            targetUser.imageUrl ??
            `https://ui-avatars.com/api/?name=${targetUser.name}`
          }
          alt={targetUser.name ?? ""}
          className="w-20 h-20 rounded-full mx-auto border-4 border-purple-400"
        />
        <h2 className="text-xl font-bold mt-2">{targetUser.name}</h2>
        <p className="text-gray-500">ID: {targetUser.displayId}</p>
        <div className="flex justify-center items-center gap-4 my-2">
          <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-sm">
            Lv. {targetUser.level}
          </span>
          {targetUser.isVip && (
            <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-sm font-bold">
              VIP
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 my-4">
          {!isSelf &&
            (targetUser.isFollowing ? (
              <button
                onClick={() => unfollow({ userId: targetUserId })}
                className="bg-gray-300 py-2 rounded-lg"
              >
                إلغاء المتابعة
              </button>
            ) : (
              <button
                onClick={() => follow({ userId: targetUserId })}
                className="bg-purple-600 text-white py-2 rounded-lg"
              >
                متابعة
              </button>
            ))}
        </div>

        {!isSelf && canManage && (
          <div className="border-t pt-4">
            <h3 className="font-bold text-lg">أدوات المشرف</h3>
            <div className="flex flex-col gap-2 mt-2">
              {isOwner &&
                (isTargetAdmin ? (
                  <button
                    onClick={() => removeAdmin({ roomId, userId: targetUserId })}
                    className="bg-orange-500 text-white py-2 rounded-lg"
                  >
                    إزالة كمشرف
                  </button>
                ) : (
                  <button
                    onClick={() => appointAdmin({ roomId, userId: targetUserId })}
                    className="bg-green-500 text-white py-2 rounded-lg"
                  >
                    تعيين كمشرف
                  </button>
                ))}
              <button
                onClick={handleKick}
                className="bg-yellow-500 text-white py-2 rounded-lg"
              >
                طرد من المقعد
              </button>
              <div className="flex gap-2">
                <select
                  value={banDuration}
                  onChange={(e) => setBanDuration(parseInt(e.target.value))}
                  className="p-2 border rounded-lg flex-grow"
                >
                  <option value={1}>دقيقة</option>
                  <option value={10}>10 دقائق</option>
                  <option value={60}>ساعة</option>
                  <option value={1440}>يوم</option>
                </select>
                <button
                  onClick={handleBan}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg"
                >
                  حظر
                </button>
              </div>
            </div>
          </div>
        )}
        <button onClick={onClose} className="mt-4 text-gray-500">
          إغلاق
        </button>
      </div>
    </div>
  );
}
