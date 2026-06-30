import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { randomBytes } from "crypto";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  const authenticated = await verifySession();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, AVIF, and GIF images are allowed" },
        { status: 400 }
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const safeName = `${Date.now()}-${randomBytes(6).toString("hex")}.webp`;

    // Compress: resize to max 2400px, convert to WebP at 82% quality
    const compressed = await sharp(bytes)
      .resize(2400, 2400, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    // Production (Vercel): upload to Vercel Blob (via OIDC or token)
    if (process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID) {
      const { put } = await import("@vercel/blob");
      const blob = await put(`uploads/${safeName}`, compressed, {
        access: "public",
        contentType: "image/webp",
      });
      return NextResponse.json({ url: blob.url });
    }

    // Development: save to local public/uploads/
    const { writeFile } = await import("fs/promises");
    const { join } = await import("path");
    const uploadDir = join(process.cwd(), "public", "uploads");
    await writeFile(join(uploadDir, safeName), compressed);
    return NextResponse.json({ url: `/uploads/${safeName}` });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
