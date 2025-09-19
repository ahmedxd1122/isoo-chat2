import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";

const vipLevels = [
  {
    level: 1,
    name: "VIP 1",
    price: 100000,
    duration: 7,
    features: ["عرض في الأعلى", "مكافآت تسجيل الدخول المزدوج", "بطاقة VIP"],
    color: "from-blue-400 to-blue-600"
  },
  {
    level: 2,
    name: "VIP 2", 
    price: 300000,
    duration: 15,
    features: ["عرض في الأعلى", "مكافآت تسجيل الدخول المزدوج", "بطاقة VIP", "قفاعة الدردشة VIP"],
    color: "from-green-400 to-green-600"
  },
  {
    level: 3,
    name: "VIP 3",
    price: 500000,
    duration: 30,
    features: ["عرض في الأعلى", "مكافآت تسجيل الدخول المزدوج", "بطاقة VIP", "قفاعة الدردشة VIP", "لافتات قبول كبار الشخصيات"],
    color: "from-purple-400 to-purple-600"
  },
  {
    level: 4,
    name: "VIP 4",
    price: 1000000,
    duration: 30,
    features: ["جميع مميزات VIP 3", "إطار الصورة الرمزية VIP", "نشر الصور في الغرفة"],
    color: "from-pink-400 to-pink-600"
  },
  {
    level: 5,
    name: "VIP 5",
    price: 2500000,
    duration: 30,
    features: ["جميع مميزات VIP 4", "ملصق VIP", "أولوية في الدعم"],
    color: "from-orange-400 to-orange-600"
  },
  {
    level: 6,
    name: "VIP 6",
    price: 5000000,
    duration: 30,
    features: ["جميع مميزات VIP 5", "تأثيرات خاصة", "وصول حصري للميزات الجديدة"],
    color: "from-yellow-400 to-yellow-600"
  }
];

export function VipPage({ onBack }: { onBack: () => void }) {
  const userProfile = useQuery(api.users.getUserProfile);
  const [selectedVip, setSelectedVip] = useState(6);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showVipBag, setShowVipBag] = useState(false);
  const [giftUserId, setGiftUserId] = useState("");

  const currentVip = vipLevels.find(v => v.level === selectedVip)!;

  const handleBuyVip = () => {
    if ((userProfile?.coins || 0) >= currentVip.price) {
      alert("تم شراء VIP بنجاح!");
      setShowBuyModal(false);
    } else {
      alert("رصيدك غير كافي لشراء هذا المستوى من VIP");
    }
  };

  const handleGiftVip = () => {
    if (!giftUserId.trim()) {
      alert("يرجى إدخال ID المستلم");
      return;
    }
    if ((userProfile?.coins || 0) >= currentVip.price) {
      alert(`تم إهداء ${currentVip.name} للمستخدم ${giftUserId} بنجاح!`);
      setShowGiftModal(false);
      setGiftUserId("");
    } else {
      alert("رصيدك غير كافي لإهداء هذا المستوى من VIP");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-yellow-900">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
        <button onClick={onBack} className="text-2xl">
          <i className="fas fa-arrow-right"></i>
        </button>
        <h1 className="text-xl font-bold">VIP</h1>
        <button onClick={() => setShowVipBag(true)} className="relative">
          <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
            <i className="fas fa-shopping-bag text-lg"></i>
          </div>
          {userProfile?.isVip && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs">
              1
            </div>
          )}
        </button>
      </header>

      {/* VIP Tabs */}
      <div className="p-4">
        <div className="flex overflow-x-auto space-x-2 space-x-reverse bg-gray-800 rounded-xl p-2">
          {vipLevels.map((vip) => (
            <button
              key={vip.level}
              onClick={() => setSelectedVip(vip.level)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                selectedVip === vip.level
                  ? "bg-yellow-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {vip.name}
            </button>
          ))}
        </div>
      </div>

      {/* VIP Card */}
      <div className="p-4">
        <div className={`bg-gradient-to-r ${currentVip.color} rounded-xl p-6 text-white shadow-xl`}>
          <div className="flex items-center mb-4">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-4xl mr-4">
              👑
            </div>
            <div>
              <h2 className="text-2xl font-bold">{currentVip.name}</h2>
              <p className="text-lg">السعر: {currentVip.price.toLocaleString()} عملة ذهبية</p>
              <p className="text-lg">المدة: {currentVip.duration} يوم</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="p-4">
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="text-xl font-bold text-yellow-400 mb-4 text-center">
            امتيازات {currentVip.name}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {currentVip.features.map((feature, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-2xl mb-2">
                  {index === 0 ? "📄" : index === 1 ? "📅" : index === 2 ? "💎" : 
                   index === 3 ? "💬" : index === 4 ? "👑" : index === 5 ? "😊" : 
                   index === 6 ? "🖼" : "😉"}
                </div>
                <p className="text-white text-sm font-semibold">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 flex gap-4">
        <button
          onClick={() => setShowBuyModal(true)}
          className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center"
        >
          <i className="fas fa-crown mr-2"></i>
          شراء VIP
        </button>
        <button
          onClick={() => setShowGiftModal(true)}
          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center"
        >
          <i className="fas fa-gift mr-2"></i>
          إهداء
        </button>
      </div>

      {/* Footer with coins */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4 flex justify-between items-center">
        <div className="flex items-center text-yellow-400 font-bold text-lg">
          <i className="fas fa-coins mr-2"></i>
          {userProfile?.coins?.toLocaleString() || 0}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowBuyModal(true)}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-bold"
          >
            شراء
          </button>
          <button
            onClick={() => setShowGiftModal(true)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg font-bold"
          >
            إهداء
          </button>
        </div>
      </div>

      {/* Buy Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-sm text-white">
            <div className="text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-2">تأكيد الشراء</h3>
              <p className="mb-4">
                سيتم خصم {currentVip.price.toLocaleString()} عملة ذهبية من رصيدك
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBuyModal(false)}
                  className="flex-1 bg-gray-600 py-3 rounded-lg font-bold"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleBuyVip}
                  className="flex-1 bg-yellow-600 py-3 rounded-lg font-bold"
                >
                  تأكيد
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
              <h3 className="text-xl font-bold mb-2">إهداء {currentVip.name}</h3>
              <p className="mb-4">
                سيتم خصم {currentVip.price.toLocaleString()} عملة ذهبية من رصيدك
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
                  onClick={handleGiftVip}
                  className="flex-1 bg-yellow-600 py-3 rounded-lg font-bold"
                >
                  إهداء الآن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIP Bag Panel */}
      {showVipBag && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed right-0 top-0 h-full w-80 bg-gray-800 shadow-xl overflow-y-auto">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">حقيبة VIP</h3>
              <button
                onClick={() => setShowVipBag(false)}
                className="text-white text-2xl"
              >
                ✕
              </button>
            </div>
            
            {userProfile?.isVip ? (
              <div className="p-4">
                <div className="bg-gray-700 rounded-xl p-4 mb-4">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center mr-3">
                      👑
                    </div>
                    <div className="text-white font-bold">VIP 6</div>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">تنتهي في: 14-10-2025</p>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-yellow-600 text-white py-2 rounded-lg text-sm font-bold">
                      استخدام
                    </button>
                    <button className="flex-1 bg-purple-600 text-white py-2 rounded-lg text-sm font-bold">
                      إهداء
                    </button>
                    <button className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-bold">
                      إلغاء
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400">
                <div className="text-6xl mb-4">🎁</div>
                <p>لا تمتلك أي عناصر VIP</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="h-20"></div>
    </div>
  );
}