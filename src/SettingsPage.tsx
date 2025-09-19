import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";

export function SettingsPage({ onBack }: { onBack: () => void }) {
  const userProfile = useQuery(api.users.getUserProfile);
  const { signOut } = useAuthActions();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [notifications, setNotifications] = useState({
    messages: true,
    gifts: true,
    follows: true,
    system: true
  });

  const settingsCategories = [
    {
      title: "الحساب",
      items: [
        { icon: "👤", name: "تعديل الملف الشخصي", action: () => alert("سيتم فتح صفحة تعديل الملف الشخصي") },
        { icon: "🔒", name: "تغيير كلمة المرور", action: () => alert("سيتم فتح صفحة تغيير كلمة المرور") },
        { icon: "📧", name: "تغيير البريد الإلكتروني", action: () => alert("سيتم فتح صفحة تغيير البريد الإلكتروني") },
        { icon: "🗑️", name: "حذف الحساب", action: () => setShowDeleteModal(true), danger: true }
      ]
    },
    {
      title: "الخصوصية والأمان",
      items: [
        { icon: "🔐", name: "إعدادات الخصوصية", action: () => setShowPrivacyModal(true) },
        { icon: "🚫", name: "المستخدمون المحظورون", action: () => alert("سيتم فتح قائمة المحظورين") },
        { icon: "📱", name: "الأجهزة المتصلة", action: () => alert("سيتم عرض الأجهزة المتصلة") },
        { icon: "🛡️", name: "التحقق بخطوتين", action: () => alert("سيتم تفعيل التحقق بخطوتين") }
      ]
    },
    {
      title: "الإشعارات",
      items: [
        { 
          icon: "💬", 
          name: "إشعارات الرسائل", 
          toggle: true,
          value: notifications.messages,
          action: () => setNotifications(prev => ({ ...prev, messages: !prev.messages }))
        },
        { 
          icon: "🎁", 
          name: "إشعارات الهدايا", 
          toggle: true,
          value: notifications.gifts,
          action: () => setNotifications(prev => ({ ...prev, gifts: !prev.gifts }))
        },
        { 
          icon: "👥", 
          name: "إشعارات المتابعة", 
          toggle: true,
          value: notifications.follows,
          action: () => setNotifications(prev => ({ ...prev, follows: !prev.follows }))
        },
        { 
          icon: "🔔", 
          name: "إشعارات النظام", 
          toggle: true,
          value: notifications.system,
          action: () => setNotifications(prev => ({ ...prev, system: !prev.system }))
        }
      ]
    },
    {
      title: "التطبيق",
      items: [
        { icon: "🌐", name: "اللغة", action: () => setShowLanguageModal(true) },
        { icon: "🎨", name: "المظهر", action: () => alert("سيتم فتح إعدادات المظهر") },
        { icon: "🔊", name: "الصوت", action: () => alert("سيتم فتح إعدادات الصوت") },
        { icon: "📱", name: "إعدادات الإشعارات", action: () => alert("سيتم فتح إعدادات الإشعارات المتقدمة") }
      ]
    },
    {
      title: "الدعم والمساعدة",
      items: [
        { icon: "❓", name: "الأسئلة الشائعة", action: () => alert("سيتم فتح صفحة الأسئلة الشائعة") },
        { icon: "📞", name: "اتصل بنا", action: () => alert("سيتم فتح صفحة التواصل") },
        { icon: "📋", name: "الشروط والأحكام", action: () => alert("سيتم عرض الشروط والأحكام") },
        { icon: "🔒", name: "سياسة الخصوصية", action: () => alert("سيتم عرض سياسة الخصوصية") }
      ]
    },
    {
      title: "أخرى",
      items: [
        { icon: "ℹ️", name: "حول التطبيق", action: () => alert("isoo chat v1.0.0") },
        { icon: "⭐", name: "قيم التطبيق", action: () => alert("شكراً لك! سيتم توجيهك لمتجر التطبيقات") },
        { icon: "📤", name: "مشاركة التطبيق", action: () => alert("سيتم فتح خيارات المشاركة") },
        { icon: "🚪", name: "تسجيل الخروج", action: () => signOut(), danger: true }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
        <button onClick={onBack} className="text-2xl">
          <i className="fas fa-arrow-right"></i>
        </button>
        <h1 className="text-xl font-bold">الإعدادات</h1>
        <div className="w-8"></div>
      </header>

      {/* User Info */}
      <div className="p-4">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 text-white mb-6">
          <div className="flex items-center">
            <img
              src={userProfile?.imageUrl ?? `https://ui-avatars.com/api/?name=${userProfile?.name}`}
              alt="Profile"
              className="w-16 h-16 rounded-full border-4 border-white mr-4"
            />
            <div>
              <h2 className="text-xl font-bold">{userProfile?.name}</h2>
              <p className="opacity-80">ID: {userProfile?.displayId}</p>
              <div className="flex items-center mt-1">
                <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                  المستوى {userProfile?.level}
                </span>
                {userProfile?.isVip && (
                  <span className="bg-yellow-500 px-2 py-1 rounded-full text-xs mr-2">
                    VIP
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Categories */}
      <div className="p-4 space-y-6">
        {settingsCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="bg-gray-800 rounded-xl p-4">
            <h3 className="text-lg font-bold text-white mb-4">{category.title}</h3>
            <div className="space-y-2">
              {category.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  onClick={item.action}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                    item.danger 
                      ? "bg-red-600 bg-opacity-20 text-red-400 hover:bg-red-600 hover:bg-opacity-30" 
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{item.icon}</span>
                    <span className="font-semibold">{item.name}</span>
                  </div>
                  {item.toggle ? (
                    <div className={`w-12 h-6 rounded-full transition-all ${
                      item.value ? "bg-green-500" : "bg-gray-500"
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-all ${
                        item.value ? "mr-6" : "mr-1"
                      }`}></div>
                    </div>
                  ) : (
                    <i className="fas fa-chevron-left text-gray-400"></i>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-sm text-white">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold mb-2 text-red-400">حذف الحساب</h3>
              <p className="mb-4 text-gray-300">
                هل أنت متأكد من رغبتك في حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-600 py-3 rounded-lg font-bold"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => {
                    alert("تم حذف الحساب");
                    setShowDeleteModal(false);
                  }}
                  className="flex-1 bg-red-600 py-3 rounded-lg font-bold"
                >
                  حذف الحساب
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-sm text-white max-h-96 overflow-y-auto">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold">إعدادات الخصوصية</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>إظهار الملف الشخصي للجميع</span>
                <div className="w-12 h-6 bg-green-500 rounded-full">
                  <div className="w-5 h-5 bg-white rounded-full mt-0.5 mr-6"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>السماح بالرسائل من الغرباء</span>
                <div className="w-12 h-6 bg-gray-500 rounded-full">
                  <div className="w-5 h-5 bg-white rounded-full mt-0.5 mr-1"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>إظهار حالة الاتصال</span>
                <div className="w-12 h-6 bg-green-500 rounded-full">
                  <div className="w-5 h-5 bg-white rounded-full mt-0.5 mr-6"></div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="w-full bg-blue-600 py-3 rounded-lg font-bold mt-6"
            >
              حفظ الإعدادات
            </button>
          </div>
        </div>
      )}

      {/* Language Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-sm text-white">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold">اختيار اللغة</h3>
            </div>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold flex items-center justify-center">
                <span className="mr-3">🇸🇦</span>
                العربية
                <i className="fas fa-check mr-auto"></i>
              </button>
              <button className="w-full bg-gray-700 text-white py-3 rounded-lg font-bold flex items-center justify-center">
                <span className="mr-3">🇺🇸</span>
                English
              </button>
              <button className="w-full bg-gray-700 text-white py-3 rounded-lg font-bold flex items-center justify-center">
                <span className="mr-3">🇫🇷</span>
                Français
              </button>
            </div>
            <button
              onClick={() => setShowLanguageModal(false)}
              className="w-full bg-gray-600 py-3 rounded-lg font-bold mt-4"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      <div className="h-20"></div>
    </div>
  );
}