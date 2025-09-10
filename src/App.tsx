import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { RoomsPage } from "./RoomsPage";
import { useState } from "react";
import { MomentsPage } from "./MomentsPage";
import { SignOutButton } from "./SignOutButton";
import { ProfileCompletionPage } from "./ProfileCompletionPage";
import { Id } from "../convex/_generated/dataModel";
import { RoomPage } from "./RoomPage";
import { ProfilePage } from "./ProfilePage";
import { MessagesPage } from "./MessagesPage";
import { ConversationPage } from "./ConversationPage";
import { MePage } from "./MePage";
import { GlobalBanner } from "./GlobalBanner";
import "./ForceRefresh";

export default function App() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const userProfile = useQuery(api.users.getUserProfile);

  const [page, setPage] = useState<"rooms" | "moments" | "messages" | "me">(
    "rooms"
  );
  const [currentRoomId, setCurrentRoomId] = useState<Id<"rooms"> | null>(null);
  const [viewingProfileId, setViewingProfileId] = useState<Id<"users"> | null>(
    null
  );
  const [currentConversationId, setCurrentConversationId] = useState<
    Id<"conversations"> | null
  >(null);
  const [conversationPartner, setConversationPartner] = useState<Id<
    "users"
  > | null>(null);

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchResults = useQuery(
    api.rooms.searchUsers,
    searchQuery ? { query: searchQuery } : "skip"
  );

  const handleUserClick = (userId: Id<"users">) => {
    setViewingProfileId(userId);
    setIsSearchVisible(false);
    setSearchQuery("");
  };

  const handleStartConversation = (userId: Id<"users">) => {
    setConversationPartner(userId);
    setViewingProfileId(null);
    setCurrentConversationId(null);
    setPage("messages");
  };

  const renderContent = () => {
    if (loggedInUser === undefined || userProfile === undefined) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-700"></div>
        </div>
      );
    }

    if (loggedInUser && userProfile === null) {
      return <ProfileCompletionPage />;
    }

    if (viewingProfileId) {
      return (
        <ProfilePage
          userId={viewingProfileId}
          onBack={() => setViewingProfileId(null)}
          onStartConversation={handleStartConversation}
        />
      );
    }

    if (currentRoomId) {
      return (
        <RoomPage
          roomId={currentRoomId}
          onBack={() => setCurrentRoomId(null)}
          onViewProfile={setViewingProfileId}
        />
      );
    }

    if (currentConversationId) {
      return (
        <ConversationPage
          conversationId={currentConversationId}
          onBack={() => setCurrentConversationId(null)}
        />
      );
    }

    if (page === "messages" && conversationPartner) {
      return (
        <ConversationPage
          partnerId={conversationPartner}
          onBack={() => setConversationPartner(null)}
        />
      );
    }

    return (
      <>
        {/* <GlobalBanner /> */}
        <header className="fixed top-0 left-0 right-0 bg-purple-100 z-50 border-b border-purple-300">
          <div className="flex justify-between items-center px-3 py-2 text-black font-semibold">
            <SignOutButton />
            <div className="flex items-center space-x-1 space-x-reverse font-extrabold text-purple-700 text-base">
              {page === "rooms" && "استكشاف"}
              {page === "moments" && "اللحظات"}
              {page === "messages" && "الرسائل"}
              {page === "me" && "أنا"}
            </div>
            <button
              aria-label="بحث"
              className="text-lg text-black"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            >
              <i className="fas fa-search"></i>
            </button>
          </div>
          {isSearchVisible && (
            <div className="px-3 pb-2 relative">
              <input
                type="text"
                placeholder="ابحث عن المستخدمين بالاسم أو المعرف"
                className="w-full rounded-md border border-purple-400 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchResults && searchQuery && (
                <ul className="absolute top-full left-3 right-3 mt-1 max-h-40 overflow-y-auto bg-white rounded-md shadow-md z-10">
                  {searchResults.map((user) =>
                    user ? (
                      <li
                        key={user._id}
                        onClick={() => handleUserClick(user.userId)}
                        className="flex items-center space-x-2 space-x-reverse p-2 hover:bg-purple-100 cursor-pointer"
                      >
                        <img
                          src={
                            user.imageUrl ??
                            `https://ui-avatars.com/api/?name=${user.name}`
                          }
                          alt={`صورة ${user.name}`}
                          className="w-6 h-6 rounded-full border border-purple-300"
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">
                            {user.name}
                          </span>
                          <span className="text-gray-600 text-xs">
                            ID: {user.displayId}
                          </span>
                        </div>
                      </li>
                    ) : null
                  )}
                </ul>
              )}
            </div>
          )}
        </header>

        <div className="flex-grow pt-14 pb-16">
          {page === "rooms" && <RoomsPage onEnterRoom={setCurrentRoomId} />}
          {page === "moments" && <MomentsPage />}
          {page === "messages" && (
            <MessagesPage onEnterConversation={setCurrentConversationId} />
          )}
          {page === "me" && <MePage />}
        </div>

        <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-purple-300 to-purple-100 border-t border-purple-400 flex justify-around items-center py-1 text-purple-400 text-xs font-semibold z-50">
          <button
            onClick={() => setPage("rooms")}
            className={`flex flex-col items-center space-y-0.5 space-y-reverse ${
              page === "rooms"
                ? "text-purple-700 font-extrabold bg-purple-200 rounded-lg px-2 py-1 shadow-lg"
                : "hover:text-purple-700"
            }`}
          >
            <i className="fas fa-users text-base"></i>
            <span>الغرف</span>
          </button>
          <button
            onClick={() => setPage("moments")}
            className={`flex flex-col items-center space-y-0.5 space-y-reverse ${
              page === "moments"
                ? "text-purple-700 font-extrabold bg-purple-200 rounded-lg px-2 py-1 shadow-lg"
                : "hover:text-purple-700"
            }`}
          >
            <i className="fas fa-clock text-base"></i>
            <span>اللحظات</span>
          </button>
          <button
            onClick={() => setPage("messages")}
            className={`flex flex-col items-center space-y-0.5 space-y-reverse ${
              page === "messages"
                ? "text-purple-700 font-extrabold bg-purple-200 rounded-lg px-2 py-1 shadow-lg"
                : "hover:text-purple-700"
            }`}
          >
            <i className="fas fa-envelope text-base"></i>
            <span>الرسائل</span>
          </button>
          <button
            onClick={() => setPage("me")}
            className={`flex flex-col items-center space-y-0.5 space-y-reverse ${
              page === "me"
                ? "text-purple-700 font-extrabold bg-purple-200 rounded-lg px-2 py-1 shadow-lg"
                : "hover:text-purple-700"
            }`}
          >
            <i className="fas fa-user text-base"></i>
            <span>أنا</span>
          </button>
        </nav>
      </>
    );
  };

  return (
    <div className="bg-gradient-to-b from-purple-300 to-purple-100 min-h-screen flex flex-col text-xs">
      <Unauthenticated>
        <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
          <h1 className="text-3xl font-bold text-purple-800 mb-4">
            أهلاً بك في غرف الدردشة
          </h1>
          <p className="text-lg text-purple-600 mb-8">
            الرجاء تسجيل الدخول للمتابعة
          </p>
          <SignInForm />
        </div>
      </Unauthenticated>
      <Authenticated>{renderContent()}</Authenticated>
    </div>
  );
}
