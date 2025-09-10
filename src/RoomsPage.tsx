import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { FormEvent, useState } from "react";

export function RoomsPage({
  onEnterRoom,
}: {
  onEnterRoom: (roomId: Id<"rooms">) => void;
}) {
  const rooms = useQuery(api.rooms.list) ?? [];
  const [showCreateRoom, setShowCreateRoom] = useState(false);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-purple-800">الغرف المتاحة</h1>
        <button
          onClick={() => setShowCreateRoom(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold"
        >
          إنشاء غرفة
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {rooms.map((room) => (
          <div
            key={room._id}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center cursor-pointer"
            onClick={() => onEnterRoom(room._id)}
          >
            <img
              src={room.image}
              alt={room.name}
              className="w-24 h-24 rounded-full object-cover mb-2"
            />
            <h2 className="font-bold text-purple-900">{room.name}</h2>
            <p className="text-sm text-gray-600">
              بواسطة {room.ownerName}
            </p>
          </div>
        ))}
      </div>
      {showCreateRoom && (
        <CreateRoomModal
          onClose={() => setShowCreateRoom(false)}
          onEnterRoom={onEnterRoom}
        />
      )}
    </div>
  );
}

function CreateRoomModal({
  onClose,
  onEnterRoom,
}: {
  onClose: () => void;
  onEnterRoom: (roomId: Id<"rooms">) => void;
}) {
  const createRoom = useMutation(api.rooms.create);
  const [name, setName] = useState("");
  const [image, setImage] = useState(""); // URL for now
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    const roomId = await createRoom({ name, image });
    setIsCreating(false);
    onClose();
    onEnterRoom(roomId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm mx-4">
        <h2 className="text-xl font-bold mb-4 text-purple-800 text-center">
          إنشاء غرفة جديدة
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="اسم الغرفة"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text"
            placeholder="رابط صورة الغرفة"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
            className="w-full p-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded-lg font-semibold"
            >
              إغلاق
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold disabled:bg-gray-400"
            >
              {isCreating ? "جاري الإنشاء..." : "إنشاء"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
