import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { FormEvent, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Id } from "../convex/_generated/dataModel";
import { PostCard } from "./PostCard";

export function MomentsPage() {
  const posts = useQuery(api.posts.list) ?? [];
  const createPost = useMutation(api.posts.create);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);

  const [newPostText, setNewPostText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      setImage(acceptedFiles[0]);
    },
  });

  const handlePost = async (e: FormEvent) => {
    e.preventDefault();
    if (!newPostText) return;
    setIsPosting(true);

    let imageId: Id<"_storage"> | undefined = undefined;
    if (image) {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": image.type },
        body: image,
      });
      const { storageId } = await result.json();
      imageId = storageId;
    }

    await createPost({ text: newPostText, imageId });
    setNewPostText("");
    setImage(null);
    setIsPosting(false);
  };

  return (
    <div className="p-4 space-y-4">
      <form
        onSubmit={handlePost}
        className="bg-white p-4 rounded-lg shadow space-y-2"
      >
        <textarea
          value={newPostText}
          onChange={(e) => setNewPostText(e.target.value)}
          placeholder="ماذا يدور في ذهنك؟"
          className="w-full p-2 border rounded-lg"
        />
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
        >
          <input {...getInputProps()} />
          {image ? (
            <p className="text-purple-700">{image.name}</p>
          ) : (
            <p className="text-gray-500">إضافة صورة</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isPosting}
          className="w-full bg-purple-600 text-white p-2 rounded-lg font-semibold disabled:bg-gray-400"
        >
          {isPosting ? "جاري النشر..." : "نشر"}
        </button>
      </form>

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}
