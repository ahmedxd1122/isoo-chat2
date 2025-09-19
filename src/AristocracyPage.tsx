import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

const aristocracyTiers = [
  {
    id: 1,
    name: "نبيل",
    price: 1000000,
    duration: 30,
    color: "from-blue-500 to-blue-700",
    icon: "🎩",
    features: [
      "لقب النبيل",
      "إطار أرستقراطي أزرق",
      "أولوية في الدعم",
      "دخول مجاني للغرف المميزة"
    ]
  },
  {
    id: 2,
    name: "كونت",
    price: 2500000,
    duration: 30,
    color: "from-purple-500 to-purple-700",
    icon: "👑",
    features: [
      "جميع مميزات النبيل",
      "لقب الكونت",
      "إطار أرستقراطي بنفسجي",
      "تأثيرات دخول خاصة",
      "قدرة على إنشاء غرف خاصة"
    ]
  },
  {
    id: 3,
    name: "دوق",
    price: 5000000,
    duration: 30,
    color: "from-red-500 to-red-700",
    icon: "⚜️",
    features: [
      "جميع مميزات الكونت",
      "لقب الدوق",
      "إطار أرستقراطي أحمر",
      "تأثيرات رسائل خاصة",
      "قدرة على طرد المستخدمين",
      "مضاعفة نقاط الخبرة"
    ]
  },
  {
    id: 4,
    name: "أمير",
    price: 10000000,
    duration: 30,
    color: "from-yellow-400 to-yellow-600",
    icon: "👑",
    features: [
      "جميع مميزات الدوق",
      "لقب الأمير",
      "إطار أرستقراطي ذهبي",
      "تأثيرات خاصة للهدايا",
      "قدرة على تعيين مشرفين",
      "وصول لجميع الميزات المدفوعة"
    ]
  },
  {
    id: 5,
    name: "ملك",
    price: 25000000,
    duration: 30,
    color: "from-gradient-to-r from-purple-600 via-pink-600 to-red-600",
    icon: "👑",
    features: [
      "جميع مميزات الأمير",
      "لقب الملك",
      "إطار ملكي متحرك",
      "تأثيرات ملكية حصرية",
      "قدرة على التحكم الكامل",
      "مميزات حصرية لا محدودة"
    ]
  }
];

export function AristocracyPage({ onBack }: { onBack: () => void }) {
  const userProfile = useQuery(api.users.getUserProfile);
  const [selectedTier, setSelectedTier] = useState(1);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [giftUserId, setGiftUserId] = useState("");

  const currentTier = aristocracyTiers.find(t => t.id === selectedTier)!;

  const handlePurchase = () => {
    if ((userProfile?.coins || 0) >= currentTier.price) {
      alert(`تم شراء لقب ${currentTier.name} بنجاح!`);
      setShowPurchaseModal(false);
    } else {
      alert("رصيدك غير كافي لشراء هذا اللقب");
    }
  };

  const handleGift = () => {
    if (!giftUserId.trim()) {
      alert("يرجى إدخال ID المستلم");
      return;
    }
    if ((userProfile?.coins || 0) >= currentTier.price) {
      alert(`تم إهداء لقب ${currentTier.name} للمستخدم ${giftUserId} بنجاح!`);
      setShowGiftModal(false);
      setGiftUserId("");
    } else {
      alert("رصيدك غير كافي لإهداء هذا اللقب");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
        <button onClick={onBack} className="text-2xl">
          <i className="fas fa-arrow-right"></i>
        </button>
        <h1 className="text-xl font-bold">الاستقراطية</h1>
        <div className="flex items-center text-yellow-300 font-bold">
          <i className="fas fa-coins mr-2"></i>
          {userProfile?.coins?.toLocaleString() || 0}
        </div>
      </header>

      {/* Tier Selection */}
      <div className="p-4">
        <div className="flex overflow-x-auto space-x-2 space-x-reverse bg-gray-800 rounded-xl p-2 mb-6">
          {aristocracyTiers.map((tier) => (
            <button
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all flex items-center ${
                selectedTier === tier.id
                  ? "bg-yellow-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span className="mr-2">{tier.icon}</span>
              {tier.name}
            </button>
          ))}
        </div>
      </div>

      {/* Current Tier Card */}
      <div className="p-4">
        <div className={`bg-gradient-to-r ${currentTier.color} rounded-xl p-6 text-white shadow-xl`}>
          <div className="flex items-center mb-4">
            <div className="text-6xl mr-4">{currentTier.icon}</div>
            <div>
              <h2 className="text-3xl font-bold">{currentTier.name}</h2>
              <p className="text-lg opacity-90">
                السعر: {currentTier.price.toLocaleString()} عملة ذهبية
              </p>
              <p className="text-lg opacity-90">المدة: {currentTier.duration} يوم</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="p-4">
        <div className="bg-gray-800 rounded-xl p-4 mb-6">
          <h3 className="text-xl font-bold text-yellow-400 mb-4 text-center">
            مميزات {currentTier.name}
          </h3>
          <div className="space-y-3">
            {currentTier.features.map((feature, index) => (
              <div key={index} className="flex items-center bg-gray-700 rounded-lg p-3">
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center mr-3">
                  <i className="fas fa-check text-white text-sm"></i>
                </div>
                <span className="text-white font-semibold">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="p-4">
        <div className="bg-gray-800 rounded-xl p-4 mb-6">
          <h3 className="text-xl font-bold text-yellow-400 mb-4 text-center">
            مقارنة الألقاب
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-white text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-right p-2">اللقب</th>
                  <th className="text-center p-2">السعر</th>
                  <th className="text-center p-2">المدة</th>
                  <th className="text-center p-2">المميزات</th>
                </tr>
              </thead>
              <tbody>
                {aristocracyTiers.map((tier) => (
                  <tr key={tier.id} className="border-b border-gray-700">
                    <td className="p-2 flex items-center">
                      <span className="mr-2">{tier.icon}</span>
                      {tier.name}
                    </td>
                    <td className="text-center p-2 text-yellow-400">
                      {tier.price.toLocaleString()}
                    </td>
                    <td className="text-center p-2">{tier.duration} يوم</td>
                    <td className="text-center p-2">{tier.features.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 flex gap-4">
        <button
          onClick={() => setShowPurchaseModal(true)}
          className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center"
        >
          <span className="mr-2">{currentTier.icon}</span>
          شراء {currentTier.name}
        </button>
        <button
          onClick={() => setShowGiftModal(true)}
          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center"
        >
          <i className="fas fa-gift mr-2"></i>
          إهداء
        </button>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-sm text-white">
            <div className="text-center">
              <div className="text-6xl mb-4">{currentTier.icon}</div>
              <h3 className="text-xl font-bold mb-2">شراء لقب {currentTier.name}</h3>
              <p className="mb-4">
                سيتم خصم {currentTier.price.toLocaleString()} عملة ذهبية من رصيدك
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPurchaseModal(false)}
                  className="flex-1 bg-gray-600 py-3 rounded-lg font-bold"
                >
                  إلغاء
                </button>
                <button
                  onClick={handlePurchase}
                  className="flex-1 bg-yellow-600 py-3 rounded-lg font-bold"
                >
                  تأكيد الشراء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gift Modal */}
      {showGiftModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-sm text-white">
            <div className="text-center">
              <div className="text-5xl mb-4">🎁</div>
              <h3 className="text-xl font-bold mb-2">إهداء لقب {currentTier.name}</h3>
              <p className="mb-4">
                سيتم خصم {currentTier.price.toLocaleString()} عملة ذهبية من رصيدك
              </p>
              <input
                type="text"
                placeholder="أدخل ID المستلم"
                value={giftUserId}
                onChange={(e) => setGiftUserId(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 text-white text-center mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowGiftModal(false)}
                  className="flex-1 bg-gray-600 py-3 rounded-lg font-bold"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleGift}
                  className="flex-1 bg-yellow-600 py-3 rounded-lg font-bold"
                >
                  إهداء الآن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="h-20"></div>
    </div>
  );
}