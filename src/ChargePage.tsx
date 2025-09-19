import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";

const chargePackages = [
  { id: 1, coins: 1000, price: 5, bonus: 0 },
  { id: 2, coins: 5000, price: 20, bonus: 500 },
  { id: 3, coins: 10000, price: 35, bonus: 1500 },
  { id: 4, coins: 25000, price: 80, bonus: 5000 },
  { id: 5, coins: 50000, price: 150, bonus: 12000 },
  { id: 6, coins: 100000, price: 280, bonus: 30000 },
];

export function ChargePage({ onBack }: { onBack: () => void }) {
  const userProfile = useQuery(api.users.getUserProfile);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handlePurchase = (packageId: number) => {
    setSelectedPackage(packageId);
    setShowPaymentModal(true);
  };

  const confirmPurchase = () => {
    // هنا يمكن إضافة منطق الدفع الحقيقي
    alert("تم الشراء بنجاح! سيتم إضافة العملات إلى حسابك قريباً");
    setShowPaymentModal(false);
    setSelectedPackage(null);
  };

  const selectedPkg = chargePackages.find(pkg => pkg.id === selectedPackage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-400 via-yellow-500 to-orange-500">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-yellow-600 text-white">
        <button onClick={onBack} className="text-2xl">
          <i className="fas fa-arrow-right"></i>
        </button>
        <h1 className="text-xl font-bold">شحن العملات الذهبية</h1>
        <div className="w-8"></div>
      </header>

      {/* Current Balance */}
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-6xl mb-4">🪙</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">رصيدك الحالي</h2>
          <p className="text-3xl font-bold text-yellow-600">
            {userProfile?.coins?.toLocaleString() || 0}
          </p>
          <p className="text-gray-600">عملة ذهبية</p>
        </div>
      </div>

      {/* Charge Packages */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-4 text-center">
          اختر باقة الشحن
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {chargePackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-xl shadow-lg p-4 relative overflow-hidden"
            >
              {pkg.bonus > 0 && (
                <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs rounded-bl-lg">
                  مكافأة +{pkg.bonus.toLocaleString()}
                </div>
              )}
              <div className="text-center">
                <div className="text-4xl mb-2">💰</div>
                <h4 className="font-bold text-lg text-gray-800">
                  {pkg.coins.toLocaleString()}
                </h4>
                {pkg.bonus > 0 && (
                  <p className="text-green-600 text-sm font-semibold">
                    + {pkg.bonus.toLocaleString()} مكافأة
                  </p>
                )}
                <p className="text-gray-600 text-sm mb-3">عملة ذهبية</p>
                <div className="text-2xl font-bold text-blue-600 mb-3">
                  ${pkg.price}
                </div>
                <button
                  onClick={() => handlePurchase(pkg.id)}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 rounded-lg font-bold hover:from-yellow-600 hover:to-orange-600 transition-all"
                >
                  شراء الآن
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-4 text-center">
          طرق الدفع المتاحة
        </h3>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3">
              <div className="text-3xl mb-2">💳</div>
              <p className="text-sm font-semibold">بطاقة ائتمان</p>
            </div>
            <div className="p-3">
              <div className="text-3xl mb-2">📱</div>
              <p className="text-sm font-semibold">محفظة رقمية</p>
            </div>
            <div className="p-3">
              <div className="text-3xl mb-2">🏦</div>
              <p className="text-sm font-semibold">تحويل بنكي</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPkg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold text-center mb-4">تأكيد الشراء</h3>
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">💰</div>
              <p className="text-lg">
                {selectedPkg.coins.toLocaleString()} عملة ذهبية
              </p>
              {selectedPkg.bonus > 0 && (
                <p className="text-green-600 font-semibold">
                  + {selectedPkg.bonus.toLocaleString()} مكافأة
                </p>
              )}
              <p className="text-2xl font-bold text-blue-600 mt-2">
                ${selectedPkg.price}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-bold"
              >
                إلغاء
              </button>
              <button
                onClick={confirmPurchase}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-lg font-bold"
              >
                تأكيد الدفع
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}