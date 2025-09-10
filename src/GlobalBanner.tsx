import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export function GlobalBanner() {
  const latestAnnouncement = useQuery(api.gifts.getLatestAnnouncement);

  if (!latestAnnouncement) {
    return null;
  }

  return (
    <div className="bg-yellow-300 text-black p-2 text-center text-sm font-semibold animate-pulse">
      🎉 {latestAnnouncement.senderName} أرسل {latestAnnouncement.giftName} إلى{" "}
      {latestAnnouncement.recipientName} في غرفة {latestAnnouncement.roomName}!
      🎉
    </div>
  );
}
