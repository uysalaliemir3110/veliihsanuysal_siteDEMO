import Link from "next/link";
import { prisma } from "@/lib/prisma";

const aspectVariants = [
  "aspect-[3/4]",
  "aspect-[4/5]",
  "aspect-[1/1]",
  "aspect-[3/4]",
  "aspect-[4/3]",
  "aspect-[3/4]",
];

const placeholderColors = [
  "#d97a6c",
  "#7c9eb2",
  "#c9a96a",
  "#8a9a7b",
  "#b08aa8",
  "#6c8c8a",
];

export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await prisma.project.findMany({
    include: { images: { orderBy: { order: "asc" } } },
    orderBy: { date: "desc" },
  });

  if (projects.length === 0) {
    return (
      <div className="pb-24 md:pb-40 px-6 md:px-12">
        <div className="py-24 text-center">
          <p className="text-sm text-muted">No projects yet.</p>
          <p className="text-xs text-muted mt-2">
            Add projects via the admin panel at{" "}
            <Link href="/admin" className="underline hover:text-foreground">
              /admin
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 md:pb-40 px-6 md:px-12">
      <div
        className="columns-1 md:columns-2 lg:columns-3"
        style={{ columnGap: "10px" }}
      >
        {projects.map((project, i) => (
          <Link
            key={project.id}
            href={`/works/${project.slug}`}
            style={{ marginBottom: "10px" }}
            className={`group inline-block w-full align-top break-inside-avoid animate-fade-up-delay-${Math.min(i + 1, 4)}`}
          >
            <div
              className={`relative overflow-hidden ${aspectVariants[i % aspectVariants.length]} flex items-center justify-center`}
              style={{ backgroundColor: placeholderColors[i % placeholderColors.length] }}
            >
              {project.coverImage && (
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              )}

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-400 px-6 bg-black/40">
                <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "#ffffff" }}>
                  {project.title}
                </h2>
                <p className="text-[10px] tracking-[0.3em] uppercase mt-3" style={{ color: "#ffffff" }}>
                  {project.client ?? "Personal"} &mdash; {project.category}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
