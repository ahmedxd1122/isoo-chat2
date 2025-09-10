import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Doc, Id } from "../convex/_generated/dataModel";
import { FormEvent, useState } from "react";

type PostWithDetails = Doc<"posts"> & {
  authorName: string;
  authorImage?: string | null;
  imageUrl?: string | null;
  comments: (Doc<"comments"> & {
    authorName: string;
    authorImage?: string | null;
  })[];
  commentCount: number;
};

export function PostCard({ post }: { post: PostWithDetails }) {
  const currentUser = useQuery(api.users.getUserProfile);
  const toggleReaction = useMutation(api.posts.react);
  const addComment = useMutation(api.posts.comment);

  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const userReaction = post.reactions.find(
    (r) => r.userId === currentUser?.userId
  )?.type;

  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!newComment) return;
    await addComment({ postId: post._id, text: newComment });
    setNewComment("");
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center mb-2">
        <img
          src={
            post.authorImage ??
            `https://ui-avatars.com/api/?name=${post.authorName}`
          }
          alt={post.authorName}
          className="w-10 h-10 rounded-full mr-2"
        />
        <span className="font-bold">{post.authorName}</span>
      </div>
      <p className="mb-2">{post.text}</p>
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="post"
          className="rounded-lg w-full object-cover"
        />
      )}
      <div className="flex justify-between items-center mt-2 text-gray-500">
        <div>
          {Object.entries(
            post.reactions.reduce((acc, r) => {
              acc[r.type] = (acc[r.type] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          ).map(([type, count]) => (
            <span key={type} className="mr-2">
              {
                { like: "👍", love: "❤️", laugh: "😂", sad: "😢" }[
                  type as string
                ]
              }{" "}
              {count}
            </span>
          ))}
        </div>
        <button onClick={() => setShowComments(!showComments)}>
          {post.commentCount} تعليقات
        </button>
      </div>
      <div className="border-t my-2"></div>
      <div className="flex justify-around">
        {(["like", "love", "laugh", "sad"] as const).map((type) => (
          <button
            key={type}
            onClick={() => toggleReaction({ postId: post._id, type })}
            className={`w-full text-center py-1 ${
              userReaction === type ? "text-purple-600 font-bold" : ""
            }`}
          >
            {
              {
                like: "أعجبني",
                love: "أحببته",
                laugh: "أضحكني",
                sad: "أحزنني",
              }[type]
            }
          </button>
        ))}
        <button
          onClick={() => setShowComments(!showComments)}
          className="w-full text-center py-1"
        >
          تعليق
        </button>
      </div>
      {showComments && (
        <div className="border-t mt-2 pt-2">
          {post.comments.map((comment) => (
            <div key={comment._id} className="flex items-start mb-2">
              <img
                src={
                  comment.authorImage ??
                  `https://ui-avatars.com/api/?name=${comment.authorName}`
                }
                alt={comment.authorName}
                className="w-8 h-8 rounded-full mr-2"
              />
              <div>
                <span className="font-bold">{comment.authorName}</span>
                <p>{comment.text}</p>
              </div>
            </div>
          ))}
          <form onSubmit={handleAddComment} className="flex mt-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="أضف تعليق..."
              className="flex-grow p-2 border rounded-l-lg"
            />
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 rounded-r-lg"
            >
              نشر
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
