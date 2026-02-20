import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import sharp from "sharp";

export async function POST(request: Request) {
    const authError = await requireAdmin();
    if (authError) return authError;

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
        return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        return NextResponse.json({ error: "파일 크기는 5MB 이하여야 합니다." }, { status: 400 });
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
        return NextResponse.json({ error: "JPG, PNG, WebP, GIF 형식만 지원합니다." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const baseName = `img_${timestamp}`;
    const uploadDir = join(process.cwd(), "public", "uploads");

    await mkdir(uploadDir, { recursive: true });

    // Generate optimized versions using sharp
    const detailPath = join(uploadDir, `${baseName}_detail.webp`);
    const thumbPath = join(uploadDir, `${baseName}_thumb.webp`);
    const originalPath = join(uploadDir, `${baseName}_original.webp`);

    await Promise.all([
        // Original (full quality WebP)
        sharp(buffer)
            .webp({ quality: 90 })
            .toFile(originalPath),
        // Detail version (max 1200px width)
        sharp(buffer)
            .resize(1200, null, { withoutEnlargement: true })
            .webp({ quality: 85 })
            .toFile(detailPath),
        // Thumbnail (max 300px width)
        sharp(buffer)
            .resize(300, null, { withoutEnlargement: true })
            .webp({ quality: 75 })
            .toFile(thumbPath),
    ]);

    return NextResponse.json({
        url: `/uploads/${baseName}_original.webp`,
        detail: `/uploads/${baseName}_detail.webp`,
        thumbnail: `/uploads/${baseName}_thumb.webp`,
    });
}
