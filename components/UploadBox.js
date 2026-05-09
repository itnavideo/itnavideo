export default function UploadBox() {
  return (
    <div className="border-2 border-dashed border-zinc-700 rounded-3xl p-16 text-center bg-zinc-900">
      <h2 className="text-3xl font-bold mb-4">
        Drag & Drop Files
      </h2>

      <p className="text-zinc-400 mb-8">
        Upload voiceovers, screenshots, or clips.
      </p>

      <button className="bg-purple-600 hover:bg-purple-500 px-8 py-4 rounded-2xl font-semibold">
        Choose Files
      </button>
    </div>
  );
}