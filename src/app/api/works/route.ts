import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export async function GET() {
  const authenticated = await verifySession();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    include: { images: { orderBy: { order: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  const authenticated = await verifySession();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const { title, client, category, description, coverImage, date, slug, images } = body;

    if (!title || typeof title !== "string" || !slug || typeof slug !== "string") {
      return NextResponse.json(
        { error: "Title and slug are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "A project with this slug already exists" },
        { status: 409 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        client: client || null,
        category: category || null,
        description: description || null,
        coverImage: coverImage || null,
        date: date ? new Date(date) : null,
        slug,
        images: {
          create: Array.isArray(images)
            ? images.map((img: { url: string; altText?: string; order?: number }, i: number) => ({
                url: img.url,
                altText: img.altText || null,
                order: img.order ?? i,
              }))
            : [],
        },
      },
      include: { images: { orderBy: { order: "asc" } } },
    });

    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
