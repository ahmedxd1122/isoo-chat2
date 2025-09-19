import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

const storeCategories = [
  { id: "frames", name: "إطارات الصور", icon: "🖼️" },
  { id: "backgrounds", name: "خلفيات الملف الشخصي", icon: "🎨" },
  { id: "effects", name: "تأثيرات خاصة", icon: "✨" },
  { id: "themes", name: "ثيمات الدردشة", icon: "💬" },
  { id: "stickers", name: "ملصقات", icon: "😊" },
  { id: "badges", name: "شارات", icon: "🏆" }
];

const storeItems = {
  frames: [
    { id: 1, name: "إطار ذهبي", price: 50000, image: "🖼️", rarity: "نادر" },
    { id: 2, name: "إطار ماسي", price: 100000, image: "💎", rarity: "أسطوري" },
    { id: 3, name: "إطار ناري", price: 75000, image: "🔥", rarity: "نادر" },
    { id: 4, name: "إطار جليدي", price: 80000, image: "❄️", rarity: "نادر" }
  ],
  backgrounds: [
    { id: 5, name: "خلفية المحيط", price: 30000, image: "🌊", rarity: "عادي" },
    { id: 6, name: "خلفية الفضاء", price: 60000, image: "🌌", rarity: "نادر" },
    { id: 7, name: "خلفية الغابة", price: 40000, image: "🌲", rarity: "عادي" },
    { id: 8, name: "خلفية الصحراء", price: 45000, image: "🏜️", rarity: "عادي" }
  ],
  effects: [
    { id: 9, name: "تأثير البرق", price: 120000, image: "⚡", rarity: "أسطوري" },
    { id: 10, name: "تأثير النجوم", price: 90000, image: "⭐", rarity: "نادر" },
    { id: 11, name: "تأثير القلوب", price: 70000, image: "💖", rarity: "نادر" },
    { id: 12, name: "تأثير الفراشات", price: 85000, image: "🦋", rarity: "نادر" }
  ],
  themes: [
    { id: 13, name: "ثيم الليل", price: 25000, image: "🌙", rarity: "عادي" },
    { id: 14, name: "ثيم الربيع", price: 35000, image: "🌸", rarity: "عادي" },
    { id: 15, name: "ثيم الصيف", price: 40000, image: "☀️", rarity: "عادي" },
    { id: 16, name: "ثيم الشتاء", price: 45000, image: "❄️", rarity: "عادي" }
  ],
  stickers: [
    { id: 17, name: "ملصق الحب", price: 15000, image: "😍", rarity: "عادي" },
    { id: 18, name: "ملصق الضحك", price: 20000, image: "😂", rarity: "عادي" },
    { id: 19, name: "ملصق الغضب", price: 18000, image: "😡", rarity: "عادي" },
    { id: 20, name: "ملصق الحزن", price: 16000, image: "😢", rarity: "عادي" }
  ],
  badges: [
    { id: 21, name: "شارة البطل", price: 200000, image: "🏆", rarity: "أسطوري" },
    { id: 22, name: "شارة النجم", price: 150000, image: "⭐", rarity: "نادر" },
    { id: 23, name: "شارة التاج", price: 180000, image: "👑", rarity: "أسطوري" },
    { id: 24, name: "شارة القلب", price: 120000, image: "💖", rarity: "نادر" }
  ]
};

export function StorePage({ onBack }: { onBack: () => void }) {
  const userProfile = useQuery(api.users.getUserProfile);
  const [selectedCategory, setSelectedCategory] = useState("frames");
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handlePurchase = (item: any) => {
    setSelectedItem(item);
    setShowPurchaseModal(true);
  };

  const confirmPurchase = () => {
    if ((userProfile?.coins || 0) >= selectedItem.price) {
      alert(`تم شراء ${selectedItem.name} بنجاح!`);
      setShowPurchaseModal(false);
      setSelectedItem(null);
    } else {
      alert("رصيدك غير كافي لشراء هذا العنصر");
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "عادي": return "text-gray-600 bg-gray-100";
      case "نادر": return "text-blue-600 bg-blue-100";
      case "أسطوري": return "text-purple-600 bg-purple-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 via-blue-600 to-indigo-700">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-purple-700 text-white">
        <button onClick={onBack} className="text-2xl">
          <i className="fas fa-arrow-right"></i>
        </button>
        <h1 className="text-xl font-bold">المتجر</h1>
        <div className="flex items-center text-yellow-300 font-bold">
          <i className="fas fa-coins mr-2"></i>
          {userProfile?.coins?.toLocaleString() || 0}
        </div>
      </header>

      {/* Categories */}
      <div className="p-4">
        <div className="flex overflow-x-auto space-x-2 space-x-reverse bg-white bg-opacity-20 rounded-xl p-2">
          {storeCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all flex items-center ${
                selectedCategory === category.id
                  ? "bg-white text-purple-700"
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
        <div className="grid grid-cols-2 gap-4">
          {storeItems[selectedCategory as keyof typeof storeItems]?.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 text-center">
                <div className="text-6xl mb-3">{item.image}</div>
                <h3 className="font-bold text-gray-800 mb-2">{item.name}</h3>
                <div className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mb-3 ${getRarityColor(item.rarity)}`}>
                  {item.rarity}
                </div>
                <div className="text-2xl font-bold text-purple-600 mb-3">
                  {item.price.toLocaleString()}
                </div>
                <button
                  onClick={() => handlePurchase(item)}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded-lg font-bold hover:from-purple-600 hover:to-blue-600 transition-all"
                >
                  شراء الآن
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <div className="text-center">
              <div className="text-6xl mb-4">{selectedItem.image}</div>
              <h3 className="text-xl font-bold mb-2">{selectedItem.name}</h3>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${getRarityColor(selectedItem.rarity)}`}>
                {selectedItem.rarity}
              </div>
              <p className="text-gray-600 mb-4">
                سيتم خصم {selectedItem.price.toLocaleString()} عملة ذهبية من رصيدك
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPurchaseModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-bold"
                >
                  إلغاء
                </button>
                <button
                  onClick={confirmPurchase}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-bold"
                >
                  تأكيد الشراء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}