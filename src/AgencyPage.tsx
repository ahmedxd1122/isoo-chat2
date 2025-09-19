import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

const agencyPackages = [
  {
    id: 1,
    name: "وكالة برونزية",
    price: 5000000,
    duration: 30,
    maxMembers: 10,
    commission: 5,
    color: "from-orange-600 to-orange-800",
    icon: "🥉",
    features: [
      "إدارة حتى 10 أعضاء",
      "عمولة 5% من أرباح الأعضاء",
      "لوحة تحكم أساسية",
      "تقارير شهرية"
    ]
  },
  {
    id: 2,
    name: "وكالة فضية",
    price: 12000000,
    duration: 30,
    maxMembers: 25,
    commission: 7,
    color: "from-gray-400 to-gray-600",
    icon: "🥈",
    features: [
      "إدارة حتى 25 عضو",
      "عمولة 7% من أرباح الأعضاء",
      "لوحة تحكم متقدمة",
      "تقارير أسبوعية",
      "دعم فني مخصص"
    ]
  },
  {
    id: 3,
    name: "وكالة ذهبية",
    price: 25000000,
    duration: 30,
    maxMembers: 50,
    commission: 10,
    color: "from-yellow-400 to-yellow-600",
    icon: "🥇",
    features: [
      "إدارة حتى 50 عضو",
      "عمولة 10% من أرباح الأعضاء",
      "لوحة تحكم شاملة",
      "تقارير يومية",
      "دعم فني 24/7",
      "أدوات تسويق متقدمة"
    ]
  },
  {
    id: 4,
    name: "وكالة ماسية",
    price: 50000000,
    duration: 30,
    maxMembers: 100,
    commission: 15,
    color: "from-blue-400 to-blue-600",
    icon: "💎",
    features: [
      "إدارة حتى 100 عضو",
      "عمولة 15% من أرباح الأعضاء",
      "لوحة تحكم احترافية",
      "تقارير فورية",
      "دعم فني مخصص",
      "أدوات تحليل متقدمة",
      "برامج تدريب للأعضاء"
    ]
  }
];

const agencyStats = {
  totalMembers: 0,
  activeMembers: 0,
  totalEarnings: 0,
  monthlyCommission: 0,
  topPerformers: []
};

export function AgencyPage({ onBack }: { onBack: () => void }) {
  const userProfile = useQuery(api.users.getUserProfile);
  const [selectedPackage, setSelectedPackage] = useState(1);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"packages" | "dashboard">("packages");
  const [hasAgency, setHasAgency] = useState(false); // محاكاة حالة امتلاك وكالة

  const currentPackage = agencyPackages.find(p => p.id === selectedPackage)!;

  const handlePurchase = () => {
    if ((userProfile?.coins || 0) >= currentPackage.price) {
      alert(`تم شراء ${currentPackage.name} بنجاح!`);
      setHasAgency(true);
      setShowPurchaseModal(false);
      setActiveTab("dashboard");
    } else {
      alert("رصيدك غير كافي لشراء هذه الوكالة");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-indigo-800 text-white">
        <button onClick={onBack} className="text-2xl">
          <i className="fas fa-arrow-right"></i>
        </button>
        <h1 className="text-xl font-bold">نظام الوكالات</h1>
        <div className="flex items-center text-yellow-300 font-bold">
          <i className="fas fa-coins mr-2"></i>
          {userProfile?.coins?.toLocaleString() || 0}
        </div>
      </header>

      {/* Tabs */}
      <div className="p-4">
        <div className="flex bg-gray-800 rounded-xl p-2">
          <button
            onClick={() => setActiveTab("packages")}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "packages"
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            باقات الوكالة
          </button>
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "dashboard"
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            لوحة التحكم
          </button>
        </div>
      </div>

      {activeTab === "packages" ? (
        <>
          {/* Package Selection */}
          <div className="p-4">
            <div className="flex overflow-x-auto space-x-2 space-x-reverse bg-gray-800 rounded-xl p-2 mb-6">
              {agencyPackages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all flex items-center ${
                    selectedPackage === pkg.id
                      ? "bg-yellow-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <span className="mr-2">{pkg.icon}</span>
                  {pkg.name}
                </button>
              ))}
            </div>
          </div>

          {/* Current Package Card */}
          <div className="p-4">
            <div className={`bg-gradient-to-r ${currentPackage.color} rounded-xl p-6 text-white shadow-xl`}>
              <div className="flex items-center mb-4">
                <div className="text-6xl mr-4">{currentPackage.icon}</div>
                <div>
                  <h2 className="text-2xl font-bold">{currentPackage.name}</h2>
                  <p className="text-lg opacity-90">
                    السعر: {currentPackage.price.toLocaleString()} عملة ذهبية
                  </p>
                  <p className="text-lg opacity-90">المدة: {currentPackage.duration} يوم</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">{currentPackage.maxMembers}</div>
                  <div className="text-sm opacity-80">عضو كحد أقصى</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold">{currentPackage.commission}%</div>
                  <div className="text-sm opacity-80">عمولة</div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="p-4">
            <div className="bg-gray-800 rounded-xl p-4 mb-6">
              <h3 className="text-xl font-bold text-yellow-400 mb-4 text-center">
                مميزات {currentPackage.name}
              </h3>
              <div className="space-y-3">
                {currentPackage.features.map((feature, index) => (
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

          {/* Purchase Button */}
          <div className="p-4">
            <button
              onClick={() => setShowPurchaseModal(true)}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center"
            >
              <span className="mr-2">{currentPackage.icon}</span>
              شراء {currentPackage.name}
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Agency Dashboard */}
          {hasAgency ? (
            <div className="p-4">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl p-4 text-white">
                  <div className="text-3xl font-bold">{agencyStats.totalMembers}</div>
                  <div className="text-sm opacity-80">إجمالي الأعضاء</div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-700 rounded-xl p-4 text-white">
                  <div className="text-3xl font-bold">{agencyStats.activeMembers}</div>
                  <div className="text-sm opacity-80">الأعضاء النشطون</div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-xl p-4 text-white">
                  <div className="text-2xl font-bold">{agencyStats.totalEarnings.toLocaleString()}</div>
                  <div className="text-sm opacity-80">إجمالي الأرباح</div>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-700 rounded-xl p-4 text-white">
                  <div className="text-2xl font-bold">{agencyStats.monthlyCommission.toLocaleString()}</div>
                  <div className="text-sm opacity-80">العمولة الشهرية</div>
                </div>
              </div>

              {/* Management Tools */}
              <div className="bg-gray-800 rounded-xl p-4 mb-6">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">أدوات الإدارة</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-blue-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center">
                    <i className="fas fa-user-plus mr-2"></i>
                    إضافة عضو
                  </button>
                  <button className="bg-green-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center">
                    <i className="fas fa-chart-bar mr-2"></i>
                    التقارير
                  </button>
                  <button className="bg-purple-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center">
                    <i className="fas fa-cog mr-2"></i>
                    الإعدادات
                  </button>
                  <button className="bg-orange-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center">
                    <i className="fas fa-graduation-cap mr-2"></i>
                    التدريب
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-800 rounded-xl p-4">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">النشاط الأخير</h3>
                <div className="space-y-3">
                  <div className="bg-gray-700 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <div className="text-white font-semibold">لا توجد أنشطة حديثة</div>
                      <div className="text-gray-400 text-sm">ابدأ بإضافة أعضاء لوكالتك</div>
                    </div>
                    <div className="text-4xl">📊</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="text-8xl mb-4">🏢</div>
              <h3 className="text-2xl font-bold text-white mb-2">لا تمتلك وكالة بعد</h3>
              <p className="text-white opacity-80 mb-6">
                اشترِ إحدى باقات الوكالة لبدء إدارة فريقك والحصول على العمولات
              </p>
              <button
                onClick={() => setActiveTab("packages")}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-xl font-bold"
              >
                عرض الباقات
              </button>
            </div>
          )}
        </>
      )}

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-sm text-white">
            <div className="text-center">
              <div className="text-6xl mb-4">{currentPackage.icon}</div>
              <h3 className="text-xl font-bold mb-2">شراء {currentPackage.name}</h3>
              <p className="mb-4">
                سيتم خصم {currentPackage.price.toLocaleString()} عملة ذهبية من رصيدك
              </p>
              <div className="bg-gray-700 rounded-lg p-3 mb-4 text-sm">
                <div className="flex justify-between mb-1">
                  <span>الحد الأقصى للأعضاء:</span>
                  <span className="text-yellow-400">{currentPackage.maxMembers}</span>
                </div>
                <div className="flex justify-between">
                  <span>نسبة العمولة:</span>
                  <span className="text-yellow-400">{currentPackage.commission}%</span>
                </div>
              </div>
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

      <div className="h-20"></div>
    </div>
  );
}