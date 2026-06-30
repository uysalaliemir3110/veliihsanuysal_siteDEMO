import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProjectGrid from "./project-grid";

export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await prisma.project.findMany({
    include: { images: { orderBy: { order: "asc" } } },
    orderBy: { order: "asc" },
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
      <ProjectGrid projects={projects} />
    </div>
  );
}
