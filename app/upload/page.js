import UploadBox from "@/components/UploadBox";

export default function UploadPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      
      <div className="max-w-5xl mx-auto">
        
        <h1 className="text-5xl font-bold mb-4">
          Upload Files
        </h1>

        <p className="text-zinc-400 mb-10">
          Upload voiceovers, screenshots, clips, and media.
        </p>

        <UploadBox />
      </div>
    </main>
  );
}