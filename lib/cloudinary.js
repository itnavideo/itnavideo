export async function uploadToCloudinary(file) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    console.error("Cloudinary config missing!");
    throw new Error("Cloudinary configuration is incomplete.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  
  // Resource type ko 'auto' rakhna theek hai, 
  // lekin hum explicitly folder aur tags add kar sakte hain indexing ke liye
  formData.append("folder", "itnavideo_uploads"); 

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`, // '/auto/' nikaal kar direct '/upload' bhi chalta hai
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error?.message || "Upload failed");
    }

    const data = await res.json();
    
    // Return standard object taaki frontend ko hamesha 'url' mile
    return {
      url: data.secure_url,
      publicId: data.public_id,
      duration: data.duration, // Audio/Video ke liye kaam aata hai
      format: data.format,
      original_filename: data.original_filename
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
}