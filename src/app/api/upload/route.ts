import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { writeFile } from "fs/promises";
import { join } from "path";
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
    const uploadDir = join(process.cwd(), "public", "uploads");

    // Resize to max 2400px on longest side, convert to WebP at 82% quality
    await sharp(bytes)
      .resize(2400, 2400, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(join(uploadDir, safeName));

    return NextResponse.json({ url: `/uploads/${safeName}` });
  } catch {
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
