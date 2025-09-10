import { useEffect } from "react";

type Gift = {
  giftUrl?: string | null;
  giftType?: "png" | "mp4" | null;
};

export function GiftOverlay({
  gift,
  onClose,
}: {
  gift: Gift;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 8000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      {gift.giftType === "mp4" ? (
        <video src={gift.giftUrl!} autoPlay muted className="max-w-full max-h-full" />
      ) : (
        <img src={gift.giftUrl!} alt="Gift" className="max-w-full max-h-full animate-ping" />
      )}
    </div>
  );
}
