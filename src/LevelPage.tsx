import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

const levelInfo = [
  { level: 1, name: "مبتدئ", minXp: 0, maxXp: 1000, color: "from-gray-400 to-gray-600", icon: "🌟" },
  { level: 2, name: "متدرب", minXp: 1000, maxXp: 2500, color: "from-green-400 to-green-600", icon: "🌱" },
  { level: 3, name: "ماهر", minXp: 2500, maxXp: 5000, color: "from-blue-400 to-blue-600", icon: "⚡" },
  { level: 4, name: "خبير", minXp: 5000, maxXp: 10000, color: "from-purple-400 to-purple-600", icon: "💎" },
  { level: 5, name: "محترف", minXp: 10000, maxXp: 20000, color: "from-orange-400 to-orange-600", icon: "🔥" },
  { level: 6, name: "أسطورة", minXp: 20000, maxXp: 50000, color: "from-red-400 to-red-600", icon: "👑" },
  { level: 7, name: "بطل", minXp: 50000, maxXp: 100000, color: "from-yellow-400 to-yellow-600", icon: "🏆" },
  { level: 8, name: "إله", minXp: 100000, maxXp: 200000, color: "from-pink-400 to-pink-600", icon: "⚡" },
  { level: 9, name: "خالد", minXp: 200000, maxXp: 500000, color: "from-indigo-400 to-indigo-600", icon: "🌌" },
  { level: 10, name: "أعظم", minXp: 500000, maxXp: 1000000, color: "from-gradient-to-r from-purple-500 via-pink-500 to-red-500", icon: "✨" }
];

const levelRewards = {
  1: ["100 عملة ذهبية", "إطار أساسي"],
  2: ["250 عملة ذهبية", "خلفية بسيطة", "ملصق ترحيبي"],
  3: ["500 عملة ذهبية", "تأثير بسيط", "شارة المتدرب"],
  4: ["1000 عملة ذهبية", "إطار متقدم", "ثيم خاص"],
  5: ["2000 عملة ذهبية", "تأثير متقدم", "شارة الخبير", "VIP لمدة 3 أيام"],
  6: ["5000 عملة ذهبية", "إطار أسطوري", "خلفية متحركة", "VIP لمدة 7 أيام"],
  7: ["10000 عملة ذهبية", "تأثير أسطوري", "شارة البطل", "VIP لمدة 15 يوم"],
  8: ["20000 عملة ذهبية", "إطار إلهي", "تأثيرات خاصة", "VIP لمدة شهر"],
  9: ["50000 عملة ذهبية", "مجموعة الخلود", "جميع التأثيرات", "VIP دائم"],
  10: ["100000 عملة ذهبية", "تاج الأعظم", "قوى خاصة", "مميزات حصرية"]
};

export function LevelPage({ onBack }: { onBack: () => void }) {
  const userProfile = useQuery(api.users.getUserProfile);
  
  // محاكاة نقاط الخبرة الحالية
  const currentXp = 3500; // يمكن استبدالها بالقيمة الحقيقية من قاعدة البيانات
  const currentLevel = userProfile?.level || 1;
  const currentLevelInfo = levelInfo.find(l => l.level === currentLevel) || levelInfo[0];
  const nextLevelInfo = levelInfo.find(l => l.level === currentLevel + 1);
  
  const progressPercentage = nextLevelInfo 
    ? ((currentXp - currentLevelInfo.minXp) / (nextLevelInfo.minXp - currentLevelInfo.minXp)) * 100
    : 100;

  const xpNeeded = nextLevelInfo ? nextLevelInfo.minXp - currentXp : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-indigo-800 text-white">
        <button onClick={onBack} className="text-2xl">
          <i className="fas fa-arrow-right"></i>
        </button>
        <h1 className="text-xl font-bold">نظام المستويات</h1>
        <div className="w-8"></div>
      </header>

      {/* Current Level Card */}
      <div className="p-4">
        <div className={`bg-gradient-to-r ${currentLevelInfo.color} rounded-xl p-6 text-white shadow-xl`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="text-6xl mr-4">{currentLevelInfo.icon}</div>
              <div>
                <h2 className="text-3xl font-bold">المستوى {currentLevel}</h2>
                <p className="text-xl opacity-90">{currentLevelInfo.name}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>نقاط الخبرة: {currentXp.toLocaleString()}</span>
              {nextLevelInfo && (
                <span>المطلوب: {nextLevelInfo.minXp.toLocaleString()}</span>
              )}
            </div>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              ></div>
            </div>
            {nextLevelInfo && (
              <p className="text-center mt-2 text-sm">
                تحتاج {xpNeeded.toLocaleString()} نقطة خبرة للمستوى التالي
              </p>
            )}
          </div>
        </div>
      </div>

      {/* How to Earn XP */}
      <div className="p-4">
        <div className="bg-white bg-opacity-10 rounded-xl p-4 mb-4">
          <h3 className="text-xl font-bold text-white mb-3 text-center">
            كيفية كسب نقاط الخبرة
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
              <div className="text-2xl mb-2">💬</div>
              <p className="text-white text-sm font-semibold">إرسال رسائل</p>
              <p className="text-white text-xs opacity-80">+5 نقاط</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
              <div className="text-2xl mb-2">🎁</div>
              <p className="text-white text-sm font-semibold">إرسال هدايا</p>
              <p className="text-white text-xs opacity-80">+10 نقاط</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
              <div className="text-2xl mb-2">📅</div>
              <p className="text-white text-sm font-semibold">تسجيل دخول يومي</p>
              <p className="text-white text-xs opacity-80">+50 نقاط</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
              <div className="text-2xl mb-2">🏆</div>
              <p className="text-white text-sm font-semibold">إنجازات خاصة</p>
              <p className="text-white text-xs opacity-80">+100 نقاط</p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Level Rewards */}
      <div className="p-4">
        <div className="bg-white bg-opacity-10 rounded-xl p-4 mb-4">
          <h3 className="text-xl font-bold text-white mb-3 text-center">
            مكافآت المستوى {currentLevel}
          </h3>
          <div className="space-y-2">
            {levelRewards[currentLevel as keyof typeof levelRewards]?.map((reward, index) => (
              <div key={index} className="flex items-center bg-white bg-opacity-20 rounded-lg p-3">
                <div className="text-2xl mr-3">🎁</div>
                <span className="text-white font-semibold">{reward}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Levels Overview */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-4 text-center">
          جميع المستويات
        </h3>
        <div className="space-y-3">
          {levelInfo.map((level) => (
            <div 
              key={level.level}
              className={`rounded-xl p-4 ${
                level.level === currentLevel 
                  ? `bg-gradient-to-r ${level.color} shadow-lg scale-105` 
                  : level.level < currentLevel
                    ? 'bg-green-600 bg-opacity-50'
                    : 'bg-white bg-opacity-10'
              } transition-all`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-3xl mr-3">{level.icon}</div>
                  <div>
                    <h4 className="text-white font-bold">المستوى {level.level}</h4>
                    <p className="text-white opacity-80 text-sm">{level.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm">
                    {level.minXp.toLocaleString()} - {level.maxXp.toLocaleString()} XP
                  </p>
                  {level.level === currentLevel && (
                    <div className="text-yellow-300 font-bold text-sm">المستوى الحالي</div>
                  )}
                  {level.level < currentLevel && (
                    <div className="text-green-300 font-bold text-sm">مكتمل ✓</div>
                  )}
                  {level.level > currentLevel && (
                    <div className="text-gray-300 text-sm">مقفل 🔒</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-20"></div>
    </div>
  );
}