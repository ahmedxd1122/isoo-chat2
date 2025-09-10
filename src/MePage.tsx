import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useNavigate } from "react-router-dom"; // إذا كنت تستخدم React Router

function LevelIcon({
  level,
  className,
}: {
  level: number;
  className?: string;
}) {
  let iconClass = "fas ";
  let title = "";
  switch (level) {
    case 1:
      iconClass += "fa-star text-yellow-400";
      title = "مستوى 1";
      break;
    case 2:
      iconClass += "fa-star-half-alt text-yellow-500";
      title = "مستوى 2";
      break;
    case 3:
      iconClass += "fa-star-of-life text-yellow-600";
      title = "مستوى 3";
      break;
    case 4:
      iconClass += "fa-gem text-blue-500";
      title = "مستوى 4";
      break;
    case 5:
      iconClass += "fa-crown text-yellow-600";
      title = "مستوى 5";
      break;
    default:
      iconClass += "fa-star text-gray-400";
      title = "مستوى غير معروف";
  }
  return <i className={`${iconClass} ${className}`} title={title}></i>;
}

export function MePage() {
  const currentUser = useQuery(api.auth.loggedInUser);
  const userProfile = useQuery(api.users.getUserProfile);
  const navigate = useNavigate(); // للتنقل بين الصفحات

  if (!currentUser || userProfile === undefined) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-700"></div>
      </div>
    );
  }

  // دالة للتعامل مع نقرات الأزرار
  const handleButtonClick = (action: string) => {
    switch (action) {
      case 'charge':
        // افتح modal أو انتقل لصفحة الشحن
        navigate('/charge'); // أو window.open('/charge', '_blank')
        break;
      case 'stores':
        navigate('/stores');
        break;
      case 'bag':
        navigate('/bag');
        break;
      case 'level':
        navigate('/level-info');
        break;
      case 'vip':
        navigate('/vip-membership');
        break;
      case 'aristocracy':
        navigate('/aristocracy');
        break;
      case 'joke-pro':
        navigate('/joke-pro');
        break;
      case 'agency':
        navigate('/agency');
        break;
      case 'settings':
        navigate('/settings');
        break;
      default:
        console.log('Action not defined');
    }
  };

  return (
    <main className="flex-grow pt-4 px-4 pb-4">
      <section className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center space-y-3">
        <img
          alt="صورة شخصية"
          className="w-24 h-24 rounded-full border-4 border-purple-500 object-cover"
          src={
            currentUser.image ??
            `https://ui-avatars.com/api/?name=${currentUser.name}`
          }
        />
        <h2 className="font-extrabold text-purple-700 text-lg truncate max-w-full">
          {currentUser.name}
        </h2>
        <p className="text-gray-600 text-xs">
          ID:
          <span className="font-semibold text-purple-700">
            {userProfile?.displayId}
          </span>
        </p>
        <div className="flex items-center space-x-2 space-x-reverse">
          <span className="text-gray-600 text-xs font-semibold">المستوى:</span>
          <LevelIcon level={userProfile?.level ?? 1} className="w-6 h-6" />
          <span className="text-purple-700 font-bold text-sm">
            {userProfile?.level ?? 1}
          </span>
        </div>
      </section>

      <section className="mt-8 flex justify-around bg-white rounded-xl shadow-md p-4">
        <button
          onClick={() => handleButtonClick('charge')}
          aria-label="الشحن"
          className="flex flex-col items-center space-y-1 space-y-reverse text-purple-700 hover:text-purple-900 focus:outline-none transition-colors duration-200"
        >
          <i className="fas fa-bolt text-2xl"></i>
          <span className="text-xs font-semibold">الشحن</span>
        </button>
        <button
          onClick={() => handleButtonClick('stores')}
          aria-label="المتاجر"
          className="flex flex-col items-center space-y-1 space-y-reverse text-purple-700 hover:text-purple-900 focus:outline-none transition-colors duration-200"
        >
          <i className="fas fa-store text-2xl"></i>
          <span className="text-xs font-semibold">المتاجر</span>
        </button>
        <button
          onClick={() => handleButtonClick('bag')}
          aria-label="الحقيبة"
          className="flex flex-col items-center space-y-1 space-y-reverse text-purple-700 hover:text-purple-900 focus:outline-none transition-colors duration-200"
        >
          <i className="fas fa-shopping-bag text-2xl"></i>
          <span className="text-xs font-semibold">الحقيبة</span>
        </button>
      </section>

      <section className="mt-8 grid grid-cols-2 gap-4">
        <div 
          onClick={() => handleButtonClick('level')}
          className="flex items-center space-x-3 space-x-reverse bg-white rounded-xl shadow-md p-4 cursor-pointer hover:bg-purple-50 transition-colors duration-200"
        >
          <i className="fas fa-layer-group text-purple-600 text-3xl"></i>
          <div>
            <h3 className="font-extrabold text-purple-700 text-sm">المستوى</h3>
            <p className="text-gray-600 text-xs">المستوى الحالي للمستخدم</p>
          </div>
        </div>
        <div 
          onClick={() => handleButtonClick('vip')}
          className="flex items-center space-x-3 space-x-reverse bg-white rounded-xl shadow-md p-4 cursor-pointer hover:bg-purple-50 transition-colors duration-200"
        >
          <i className="fas fa-crown text-yellow-400 text-3xl"></i>
          <div>
            <h3 className="font-extrabold text-purple-700 text-sm">VIP</h3>
            <p className="text-gray-600 text-xs">حالة المستخدم المميزة</p>
          </div>
        </div>
        <div 
          onClick={() => handleButtonClick('aristocracy')}
          className="flex items-center space-x-3 space-x-reverse bg-white rounded-xl shadow-md p-4 cursor-pointer hover:bg-purple-50 transition-colors duration-200"
        >
          <i className="fas fa-user-shield text-purple-800 text-3xl"></i>
          <div>
            <h3 className="font-extrabold text-purple-700 text-sm">
              الاستقراطية
            </h3>
            <p className="text-gray-600 text-xs">مستوى النخبة الخاص</p>
          </div>
        </div>
        <div 
          onClick={() => handleButtonClick('joke-pro')}
          className="flex items-center space-x-3 space-x-reverse bg-white rounded-xl shadow-md p-4 cursor-pointer hover:bg-purple-50 transition-colors duration-200"
        >
          <i className="fas fa-laugh-beam text-green-500 text-3xl"></i>
          <div>
            <h3 className="font-extrabold text-purple-700 text-sm">مزحة PRO</h3>
            <p className="text-gray-600 text-xs">الوصول إلى مزحات احترافية</p>
          </div>
        </div>
        <div 
          onClick={() => handleButtonClick('agency')}
          className="flex items-center space-x-3 space-x-reverse bg-white rounded-xl shadow-md p-4 cursor-pointer hover:bg-purple-50 transition-colors duration-200"
        >
          <i className="fas fa-building text-indigo-600 text-3xl"></i>
          <div>
            <h3 className="font-extrabold text-purple-700 text-sm">الوكالة</h3>
            <p className="text-gray-600 text-xs">إدارة الوكالات الخاصة</p>
          </div>
        </div>
        <div 
          onClick={() => handleButtonClick('settings')}
          className="flex items-center space-x-3 space-x-reverse bg-white rounded-xl shadow-md p-4 cursor-pointer hover:bg-purple-50 transition-colors duration-200"
        >
          <i className="fas fa-cog text-purple-700 text-3xl"></i>
          <div>
            <h3 className="font-extrabold text-purple-700 text-sm">الإعدادات</h3>
            <p className="text-gray-600 text-xs">تخصيص حسابك</p>
          </div>
        </div>
      </section>
    </main>
  );
}          ID:
          <span className="font-semibold text-purple-700">
            {userProfile?.displayId}
          </span>
        </p>
        <div className="flex items-center space-x-2 space-x-reverse">
          <span className="text-gray-600 text-xs font-semibold">المستوى:</span>
          <LevelIcon level={userProfile?.level ?? 1} className="w-6 h-6" />
          <span className="text-purple-700 font-bold text-sm">
            {userProfile?.level ?? 1}
          </span>
        </div>
      </section>

      <section className="mt-8 flex justify-around bg-white rounded-xl shadow-md p-4">
        <button
          onClick={() => handleButtonClick('charge')}
          aria-label="الشحن"
          className="flex flex-col items-center space-y-1 space-y-reverse text-purple-700 hover:text-purple-900 focus:outline-none transition-colors duration-200"
        >
          <i className="fas fa-bolt text-2xl"></i>
          <span className="text-xs font-semibold">الشحن</span>
        </button>
        <button
          onClick={() => handleButtonClick('stores')}
          aria-label="المتاجر"
          className="flex flex-col items-center space-y-1 space-y-reverse text-purple-700 hover:text-purple-900 focus:outline-none transition-colors duration-200"
        >
          <i className="fas fa-store text-2xl"></i>
          <span className="text-xs font-semibold">المتاجر</span>
        </button>
        <button
          onClick={() => handleButtonClick('bag')}
          aria-label="الحقيبة"
          className="flex flex-col items-center space-y-1 space-y-reverse text-purple-700 hover:text-purple-900 focus:outline-none transition-colors duration-200"
        >
          <i className="fas fa-shopping-bag text-2xl"></i>
          <span className="text-xs font-semibold">الحقيبة</span>
        </button>
      </section>

      <section className="mt-8 grid grid-cols-2 gap-4">
        <div 
          onClick={() => handleButtonClick('level')}
          className="flex items-center space-x-3 space-x-reverse bg-white rounded-xl shadow-md p-4 cursor-pointer hover:bg-purple-50 transition-colors duration-200"
        >
          <i className="fas fa-layer-group text-purple-600 text-3xl"></i>
          <div>
            <h3 className="font-extrabold text-purple-700 text-sm">المستوى</h3>
            <p className="text-gray-600 text-xs">المستوى الحالي للمستخدم</p>
          </div>
        </div>
        <div 
          onClick={() => handleButtonClick('vip')}
          className="flex items-center space-x-3 space-x-reverse bg-white rounded-xl shadow-md p-4 cursor-pointer hover:bg-purple-50 transition-colors duration-200"
        >
          <i className="fas fa-crown text-yellow-400 text-3xl"></i>
          <div>
            <h3 className="font-extrabold text-purple-700 text-sm">VIP</h3>
            <p className="text-gray-600 text-xs">حالة المستخدم المميزة</p>
          </div>
        </div>
        <div 
          onClick={() => handleButtonClick('aristocracy')}
          className="flex items-center space-x-3 space-x-reverse bg-white rounded-xl shadow-md p-4 cursor-pointer hover:bg-purple-50 transition-colors duration-200"
        >
          <i className="fas fa-user-shield text-purple-800 text-3xl"></i>
          <div>
            <h3 className="font-extrabold text-purple-700 text-sm">
              الاستقراطية
            </h3>
            <p className="text-gray-600 text-xs">مستوى النخبة الخاص</p>
          </div>
        </div>
        <div 
          onClick={() => handleButtonClick('joke-pro')}
          className="flex items-center space-x-3 space-x-reverse bg-white rounded-xl shadow-md p-4 cursor-pointer hover:bg-purple-50 transition-colors duration-200"
        >
          <i className="fas fa-laugh-beam text-green-500 text-3xl"></i>
          <div>
            <h3 className="font-extrabold text-purple-700 text-sm">مزحة PRO</h3>
            <p className="text-gray-600 text-xs">الوصول إلى مزحات احترافية</p>
          </div>
        </div>
        <div 
          onClick={() => handleButtonClick('agency')}
          className="flex items-center space-x-3 space-x-reverse bg-white rounded-xl shadow-md p-4 cursor-pointer hover:bg-purple-50 transition-colors duration-200"
        >
          <i className="fas fa-building text-indigo-600 text-3xl"></i>
          <div>
            <h3 className="font-extrabold text-purple-700 text-sm">الوكالة</h3>
            <p className="text-gray-600 text-xs">إدارة الوكالات الخاصة</p>
          </div>
        </div>
        <div 
          onClick={() => handleButtonClick('settings')}
          className="flex items-center space-x-3 space-x-reverse bg-white rounded-xl shadow-md p-4 cursor-pointer hover:bg-purple-50 transition-colors duration-200"
        >
          <i className="fas fa-cog text-purple-700 text-3xl"></i>
          <div>
            <h3 className="font-extrabold text-purple-700 text-sm">الإعدادات</h3>
            <p className="text-gray-600 text-xs">تخصيص حسابك</p>
          </div>
        </div>
      </section>
    </main>
  );
}
