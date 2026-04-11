/** Unsigned upload to Cloudinary (main website admin only). No API keys or Authorization headers. */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "dxrxbvgji";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
const UPLOAD_PRESET = "mas_coffee_preset";

export type CloudinaryUploadResult =
  | { ok: true; secure_url: string }
  | { ok: false; message: string; status?: number };

export async function uploadMainSiteImage(file: File): Promise<CloudinaryUploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const msg =
      (data as { error?: { message?: string } }).error?.message ||
      `Upload failed (${response.status})`;
    return { ok: false, message: msg, status: response.status };
  }

  const url = (data as { secure_url?: string }).secure_url;
  if (!url) {
    return {
      ok: false,
      message:
        (data as { error?: { message?: string } }).error?.message ||
        "No image URL returned",
    };
  }

  return { ok: true, secure_url: url };
}
