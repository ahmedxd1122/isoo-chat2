import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { FormEvent, useState } from "react";
import { Id } from "../convex/_generated/dataModel";
import { useDropzone } from "react-dropzone";

export function ProfileCompletionPage() {
  const completeProfile = useMutation(api.users.completeProfile);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [birthDate, setBirthDate] = useState("");
  const [country, setCountry] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      setImage(acceptedFiles[0]);
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
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

    await completeProfile({
      name,
      gender,
      birthDate,
      country,
      imageId,
    });
    // No need to set isSubmitting to false, as the page will be replaced
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-purple-50">
      <h1 className="text-2xl font-bold text-purple-800 mb-4">
        أكمل ملفك الشخصي
      </h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 bg-white p-6 rounded-lg shadow-md"
      >
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-purple-400 rounded-lg p-4 text-center cursor-pointer hover:bg-purple-100"
        >
          <input {...getInputProps()} />
          {image ? (
            <p className="text-purple-800">{image.name}</p>
          ) : (
            <p className="text-gray-500">
              اسحب وأفلت صورة الملف الشخصي هنا، أو انقر للاختيار
            </p>
          )}
        </div>
        <input
          type="text"
          placeholder="الاسم"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value as "male" | "female")}
          className="w-full p-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="male">ذكر</option>
          <option value="female">أنثى</option>
        </select>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          required
          className="w-full p-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="text"
          placeholder="الدولة"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
          className="w-full p-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-purple-600 text-white p-2 rounded-lg font-semibold disabled:bg-gray-400"
        >
          {isSubmitting ? "جاري الحفظ..." : "حفظ الملف الشخصي"}
        </button>
      </form>
    </div>
  );
}
