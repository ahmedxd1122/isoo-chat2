import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { FormEvent, useEffect, useRef, useState } from "react";
import { UserInfoPopup } from "./UserInfoPopup";
import { GiftPanel } from "./GiftPanel";
import { useAgora } from "./useAgora";
import AgoraRTC, { IAgoraRTCClient } from "agora-rtc-sdk-ng";

type SeatedUserWithNull = NonNullable<
  ReturnType<typeof useQuery<typeof api.rooms.get>>
>["seats"][number];

type SeatedUser = NonNullable<SeatedUserWithNull>;

const agoraClient: IAgoraRTCClient = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});

export function RoomPage({
  roomId,
  onBack,
}: {
  roomId: Id<"rooms">;
  onBack: () => void;
}) {
  const room = useQuery(api.rooms.get, { id: roomId });
  const messages = useQuery(api.chat.list, { roomId });
  const currentUser = useQuery(api.users.getUserProfile);
  const generateToken = useMutation(api.agora.generateToken);
  const takeSeat = useMutation(api.rooms.takeSeat);
  const sendMessage = useMutation(api.chat.send);

  const [newMessage, setNewMessage] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<Id<"users"> | null>(
    null
  );
  const [showGiftPanel, setShowGiftPanel] = useState(false);
  const [agoraToken, setAgoraToken] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (roomId && currentUser) {
      generateToken({ channelName: roomId }).then(setAgoraToken);
    }
  }, [roomId, generateToken, currentUser]);

  const { isMuted, isSpeakersMuted, toggleMute, toggleSpeakers } = useAgora(
    agoraClient,
    process.env.VITE_AGORA_APP_ID!,
    roomId,
    agoraToken,
    currentUser?.userId ?? ""
  );

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (!room || !currentUser) {
    return (
      <div className="flex justify-center items-center h-screen bg-purple-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white"></div>
      </div>
    );
  }

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() !== "") {
      try {
        await sendMessage({ roomId, text: newMessage });
        setNewMessage("");
      } catch (error) {
        console.error(error);
        alert((error as Error).message);
      }
    }
  };

  const handleSeatClick = (
    seatIndex: number,
    seatedUser: SeatedUserWithNull
  ) => {
    if (seatedUser) {
      setSelectedUserId(seatedUser.userId);
    } else {
      takeSeat({ roomId, seatIndex }).catch((err) => alert(err.message));
    }
  };

  const onlineUserCount = room.seats?.filter((s) => s !== null).length ?? 0;
  const isUserSeated = room.seats?.some((s) => s?.userId === currentUser.userId);

  return (
    <div className="h-screen flex flex-col">
      <div className="fixed inset-0 bg-gradient-to-b from-[#3f2a9f] to-[#7a3dbb] -z-10"></div>
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-[#2a1f6e] flex items-center space-x-3 p-3 z-30">
        <img
          alt={room.name}
          className="w-10 h-10 rounded-lg object-cover"
          src={room.image}
        />
        <div className="flex flex-col text-white">
          <span className="text-base font-semibold">{room.name}</span>
          <span className="text-xs font-semibold">ID: {room.displayId}</span>
        </div>
        <button
          onClick={onBack}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-2xl"
        >
          <i className="fas fa-arrow-left"></i>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Seats Area */}
        <div className="flex-shrink-0 z-20 bg-gradient-to-b from-[#3f2a9f] to-[#5c33ac] pb-3">
          <div className="flex justify-between px-4 my-4">
            <div className="flex items-center space-x-1 bg-[#2a1f6e] rounded-full px-2 py-0.5 text-base font-semibold min-w-[40px] justify-center text-white">
              <span>{onlineUserCount}</span>
              <i className="fas fa-user-friends text-lg"></i>
            </div>
          </div>
          <div className="relative px-6 grid grid-cols-4 gap-x-3 gap-y-4">
            {Array.from({ length: 12 }).map((_, index) => {
              const seatedUser = room.seats?.[index];
              const isSpeaking = room.speakingSeatIndex === index;
              return (
                <button
                  key={index}
                  type="button"
                  className="flex flex-col items-center space-y-1 focus:outline-none relative text-white"
                  onClick={() => handleSeatClick(index, seatedUser)}
                >
                  <div
                    className={`w-14 h-14 rounded-full border flex items-center justify-center text-3xl font-light relative ${
                      isSpeaking
                        ? "border-cyan-400 border-2 animate-pulse"
                        : "border-white/40"
                    }`}
                  >
                    {seatedUser ? (
                      <>
                        <img
                          src={
                            seatedUser.imageUrl ??
                            `https://ui-avatars.com/api/?name=${seatedUser.name}`
                          }
                          alt={seatedUser.name ?? ""}
                          className="w-full h-full rounded-full object-cover"
                        />
                        {isSpeaking && (
                          <i className="fas fa-microphone absolute -top-2 left-0 text-cyan-400 text-xl z-20"></i>
                        )}
                      </>
                    ) : (
                      "+"
                    )}
                  </div>
                  <span className="text-white/60 text-xs font-semibold">
                    {index + 1}
                  </span>
                  {seatedUser && (
                    <span className="text-white text-xs font-semibold truncate max-w-[56px] text-center">
                      {seatedUser.name}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Messages */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 space-y-3 py-2"
        >
          {messages?.map((message) => (
            <div key={message._id} className="flex items-start space-x-2">
              {message.isSystemMessage ? (
                <div className="text-center w-full text-purple-300 text-xs italic py-1">
                  {message.text}
                </div>
              ) : (
                <>
                  <img
                    src={
                      message.author?.imageUrl ??
                      `https://ui-avatars.com/api/?name=${message.author?.name}`
                    }
                    alt={message.author?.name ?? ""}
                    className="w-8 h-8 rounded-full cursor-pointer"
                    onClick={() =>
                      message.authorId && setSelectedUserId(message.authorId)
                    }
                  />
                  <div className="flex-1">
                    <span className="font-semibold text-xs block mb-0.5 text-white">
                      {message.author?.name}
                    </span>
                    <div className="bg-[#2a1f6e] rounded-lg py-1.5 px-3 w-max max-w-xs text-xs text-white">
                      {message.text && <p>{message.text}</p>}
                      {message.gift && (
                        <div className="flex items-center gap-1">
                          <span>أرسل</span>
                          <img
                            src={message.gift.url}
                            alt={message.gift.name}
                            className="w-6 h-6"
                          />
                          <span>{message.gift.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="flex-shrink-0 h-16 bg-[#2a1f6e] py-2 px-3 flex items-center space-x-2 z-30 text-white">
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-lg">
          <i className="fas fa-envelope"></i>
        </button>
        <button
          onClick={() => setShowGiftPanel(true)}
          className="w-10 h-10 rounded-full bg-yellow-400 shadow-[0_0_10px_#facc15] flex items-center justify-center text-lg"
        >
          <i className="fas fa-gift"></i>
        </button>
        <form
          onSubmit={handleSendMessage}
          className="flex-1 flex items-center space-x-2"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="اكتب رسالة"
            className="flex-1 rounded-full bg-[#3a2a7a] py-1.5 px-3 placeholder-white/70 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-600 transition-colors rounded-full w-10 h-10 text-lg flex items-center justify-center"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
        {isUserSeated && (
          <>
            <button
              onClick={toggleMute}
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
            >
              <i
                className={`fas ${
                  isMuted ? "fa-microphone-slash text-red-500" : "fa-microphone"
                }`}
              ></i>
            </button>
            <button
              onClick={toggleSpeakers}
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
            >
              <i
                className={`fas ${
                  isSpeakersMuted ? "fa-volume-mute text-red-500" : "fa-volume-up"
                }`}
              ></i>
            </button>
          </>
        )}
      </footer>

      {/* Popups */}
      {selectedUserId && (
        <UserInfoPopup
          targetUserId={selectedUserId}
          roomId={roomId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
      {showGiftPanel && (
        <GiftPanel
          roomId={roomId}
          onClose={() => setShowGiftPanel(false)}
          seatedUsers={
            room.seats?.filter((s): s is SeatedUser => s !== null) ?? []
          }
        />
      )}
    </div>
  );
}
