import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

const bagCategories = [
  { id: "all", name: "الكل", icon: "📦" },
  { id: "frames", name: "الإطارات", icon: "🖼️" },
  { id: "backgrounds", name: "الخلفيات", icon: "🎨" },
  { id: "effects", name: "التأثيرات", icon: "✨" },
  { id: "themes", name: "الثيمات", icon: "💬" },
  { id: "stickers", name: "الملصقات", icon: "😊" },
  { id: "badges", name: "الشارات", icon: "🏆" }
];

// عناصر وهمية للحقيبة
const bagItems = [
  { id: 1, name: "إطار ذهبي", type: "frames", image: "🖼️", rarity: "نادر", equipped: true, expiry: "2025-12-31" },
  { id: 2, name: "خلفية المحيط", type: "backgrounds", image: "🌊", rarity: "عادي", equipped: false, expiry: null },
  { id: 3, name: "تأثير النجوم", type: "effects", image: "⭐", rarity: "نادر", equipped: false, expiry: "2025-06-15" },
  { id: 4, name: "ثيم الليل", type: "themes", image: "🌙", rarity: "عادي", equipped: true, expiry: null },
  { id: 5, name: "ملصق الحب", type: "stickers", image: "😍", rarity: "عادي", equipped: false, expiry: null },
  { id: 6, name: "شارة البطل", type: "badges", image: "🏆", rarity: "أسطوري", equipped: false, expiry: "2025-08-20" }
];

export function BagPage({ onBack }: { onBack: () => void }) {
  const userProfile = useQuery(api.users.getUserProfile);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [giftUserId, setGiftUserId] = useState("");

  const filteredItems = selectedCategory === "all" 
    ? bagItems 
    : bagItems.filter(item => item.type === selectedCategory);

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setShowItemModal(true);
  };

  const handleEquip = () => {
    alert(`تم تجهيز ${selectedItem.name} بنجاح!`);
    setShowItemModal(false);
  };

  const handleUnequip = () => {
    alert(`تم إلغاء تجهيز ${selectedItem.name}`);
    setShowItemModal(false);
  };

  const handleGift = () => {
    setShowItemModal(false);
    setShowGiftModal(true);
  };

  const confirmGift = () => {
    if (!giftUserId.trim()) {
      alert("يرجى إدخال ID المستلم");
      return;
    }
    alert(`تم إهداء ${selectedItem.name} للمستخدم ${giftUserId} بنجاح!`);
    setShowGiftModal(false);
    setGiftUserId("");
    setSelectedItem(null);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "عادي": return "text-gray-600 bg-gray-100";
      case "نادر": return "text-blue-600 bg-blue-100";
      case "أسطوري": return "text-purple-600 bg-purple-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const isExpired = (expiry: string | null) => {
    if (!expiry) return false;
    return new Date(expiry) < new Date();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-600 via-teal-600 to-blue-700">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-green-700 text-white">
        <button onClick={onBack} className="text-2xl">
          <i className="fas fa-arrow-right"></i>
        </button>
        <h1 className="text-xl font-bold">الحقيبة</h1>
        <div className="text-lg font-bold">
          {filteredItems.length} عنصر
        </div>
      </header>

      {/* Categories */}
      <div className="p-4">
        <div className="flex overflow-x-auto space-x-2 space-x-reverse bg-white bg-opacity-20 rounded-xl p-2">
          {bagCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all flex items-center ${
                selectedCategory === category.id
                  ? "bg-white text-green-700"
                  : "text-white hover:bg-white hover:bg-opacity-20"
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="p-4">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all hover:scale-105 ${
                  isExpired(item.expiry) ? 'opacity-50' : ''
                }`}
                onClick={() => handleItemClick(item)}
              >
                <div className="p-4 text-center relative">
                  {item.equipped && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      مُجهز
                    </div>
                  )}
                  {isExpired(item.expiry) && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      منتهي
                    </div>
                  )}
                  <div className="text-6xl mb-3">{item.image}</div>
                  <h3 className="font-bold text-gray-800 mb-2">{item.name}</h3>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mb-2 ${getRarityColor(item.rarity)}`}>
                    {item.rarity}
                  </div>
                  {item.expiry && (
                    <p className="text-xs text-gray-500">
                      {isExpired(item.expiry) ? 'منتهي الصلاحية' : `ينتهي في: ${item.expiry}`}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-8xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-white mb-2">الحقيبة فارغة</h3>
            <p className="text-white opacity-80">لا توجد عناصر في هذه الفئة</p>
          </div>
        )}
      </div>

      {/* Item Modal */}
      {showItemModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <div className="text-center">
              <div className="text-8xl mb-4">{selectedItem.image}</div>
              <h3 className="text-xl font-bold mb-2">{selectedItem.name}</h3>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${getRarityColor(selectedItem.rarity)}`}>
                {selectedItem.rarity}
              </div>
              {selectedItem.expiry && (
                <p className="text-gray-600 mb-4">
                  {isExpired(selectedItem.expiry) ? 'منتهي الصلاحية' : `ينتهي في: ${selectedItem.expiry}`}
                </p>
              )}
              <div className="flex flex-col gap-3">
                {!isExpired(selectedItem.expiry) && (
                  <>
                    {selectedItem.equipped ? (
                      <button
                        onClick={handleUnequip}
                        className="w-full bg-red-500 text-white py-3 rounded-lg font-bold"
                      >
                        إلغاء التجهيز
                      </button>
                    ) : (
                      <button
                        onClick={handleEquip}
                        className="w-full bg-green-500 text-white py-3 rounded-lg font-bold"
                      >
                        تجهيز
                      </button>
                    )}
                    <button
                      onClick={handleGift}
                      className="w-full bg-purple-500 text-white py-3 rounded-lg font-bold"
                    >
                      إهداء
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowItemModal(false)}
                  className="w-full bg-gray-300 text-gray-700 py-3 rounded-lg font-bold"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gift Modal */}
      {showGiftModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <div className="text-center">
              <div className="text-6xl mb-4">🎁</div>
              <h3 className="text-xl font-bold mb-2">إهداء {selectedItem.name}</h3>
              <p className="text-gray-600 mb-4">
                سيتم إرسال هذا العنصر إلى المستخدم المحدد
              </p>
              <input
                type="text"
                placeholder="أدخل ID المستلم"
                value={giftUserId}
                onChange={(e) => setGiftUserId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-center mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowGiftModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-bold"
                >
                  إلغاء
                </button>
                <button
                  onClick={confirmGift}
                  className="flex-1 bg-purple-500 text-white py-3 rounded-lg font-bold"
                >
                  إهداء الآن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}