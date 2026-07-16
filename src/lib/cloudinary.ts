// Cloudinary Image Management Utility

export function isCloudinaryConfigured(): boolean {
  const env = (import.meta as any).env;
  return !!env.VITE_CLOUDINARY_CLOUD_NAME && !!env.VITE_CLOUDINARY_UPLOAD_PRESET;
}

/**
 * Uploads a file (image) to Cloudinary via their REST API using an unsigned/signed upload preset.
 * Fallbacks to a safe local Object URL or high-quality placeholder if Cloudinary is not configured.
 * 
 * @param file The image file to upload
 * @returns The secure URL of the uploaded image or placeholder URL
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  const env = (import.meta as any).env;
  const cloudName = env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    console.warn(
      "Cloudinary is not configured. Please supply VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env or platform settings. Simulating offline upload with a temporary local URL."
    );
    // Create a local object URL so the user can see their image instantly in the local session
    return URL.createObjectURL(file);
  }

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudinary Upload Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Successfully uploaded image to Cloudinary:", data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed, falling back to local object URL:", error);
    return URL.createObjectURL(file);
  }
}
