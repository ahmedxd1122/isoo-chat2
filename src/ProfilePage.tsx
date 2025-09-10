import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

export function ProfilePage({
  userId,
  onBack,
  onStartConversation,
}: {
  userId: Id<"users">;
  onBack: () => void;
  onStartConversation: (userId: Id<"users">) => void;
}) {
  const profile = useQuery(api.users.getProfileForPage, { userId });
  const follow = useMutation(api.users.follow);
  const unfollow = useMutation(api.users.unfollow);
  const currentUser = useQuery(api.users.getUserProfile);

  if (!profile || !currentUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-700"></div>
      </div>
    );
  }

  const isSelf = currentUser.userId === userId;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="relative">
        <img
          src={
            profile.backgroundImageUrl ?? "https://placehold.co/600x200/d8b4fe/3730a3?text=+"
          }
          alt="background"
          className="w-full h-48 object-cover"
        />
        <button
          onClick={onBack}
          className="absolute top-4 left-4 bg-white bg-opacity-70 rounded-full w-8 h-8 flex items-center justify-center"
        >
          <i className="fas fa-arrow-left text-purple-800"></i>
        </button>
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
          <img
            src={
              profile.imageUrl ??
              `https://ui-avatars.com/api/?name=${profile.name}&background=random`
            }
            alt="profile"
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
          />
        </div>
      </div>
      <div className="pt-16 text-center">
        <h1 className="text-2xl font-bold text-purple-900">{profile.name}</h1>
        <p className="text-sm text-gray-500">ID: {profile.displayId}</p>
        <div className="mt-2 px-4 py-1 bg-purple-200 text-purple-800 rounded-full inline-block">
          Lv. {profile.level}
        </div>
      </div>
      <div className="flex justify-around my-4 border-y py-2">
        <div className="text-center">
          <div className="font-bold">{profile.followers}</div>
          <div className="text-sm text-gray-600">متابع</div>
        </div>
        <div className="text-center">
          <div className="font-bold">{profile.following}</div>
          <div className="text-sm text-gray-600">يتابع</div>
        </div>
      </div>
      {!isSelf && (
        <div className="flex justify-center gap-4 my-4">
          {profile.isFollowing ? (
            <button
              onClick={() => unfollow({ userId })}
              className="bg-gray-300 text-black px-6 py-2 rounded-full font-semibold"
            >
              إلغاء المتابعة
            </button>
          ) : (
            <button
              onClick={() => follow({ userId })}
              className="bg-purple-600 text-white px-6 py-2 rounded-full font-semibold"
            >
              متابعة
            </button>
          )}
          <button
            onClick={() => onStartConversation(userId)}
            className="border border-purple-600 text-purple-600 px-6 py-2 rounded-full font-semibold"
          >
            رسالة
          </button>
        </div>
      )}
      <div className="p-4">
        <h2 className="font-bold text-lg mb-2">اللحظات</h2>
        <div className="grid grid-cols-3 gap-1">
          {profile.posts.map((post: any) => (
            <img
              key={post._id}
              src={post.imageUrl ?? "https://placehold.co/200x200"}
              alt="post"
              className="w-full aspect-square object-cover rounded"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
