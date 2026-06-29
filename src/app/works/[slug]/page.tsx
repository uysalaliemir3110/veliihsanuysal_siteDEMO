import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const placeholderColors = [
  "#d97a6c",
  "#7c9eb2",
  "#c9a96a",
  "#8a9a7b",
  "#b08aa8",
  "#6c8c8a",
  "#c4816e",
  "#6b8fa3",
  "#b89b5c",
  "#7a8b6d",
];

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!project) notFound();

  const layoutItems: { type: "wide" | "pair"; indices: number[] }[] = [];
  let i = 0;
  const imgs = project.images;

  while (i < imgs.length) {
    if (i % 5 === 0) {
      layoutItems.push({ type: "wide", indices: [i] });
      i++;
    } else {
      const pair = [i];
      if (i + 1 < imgs.length) pair.push(i + 1);
      layoutItems.push({ type: "pair", indices: pair });
      i += pair.length;
    }
  }

  return (
    <div className="pb-24 md:pb-40 px-6 md:px-12">
      <div className="flex flex-col" style={{ gap: "10px" }}>
        {layoutItems.map((item, groupIdx) => {
          if (item.type === "wide") {
            const idx = item.indices[0];
            const image = imgs[idx];
            return (
              <div
                key={image.id}
                className={`w-full overflow-hidden animate-fade-up-delay-${Math.min(groupIdx + 1, 4)}`}
              >
                {image.url ? (
                  <img
                    src={image.url}
                    alt={image.altText ?? ""}
                    className="w-full h-auto block"
                  />
                ) : (
                  <div
                    className="w-full aspect-[16/9] flex items-center justify-center"
                    style={{ backgroundColor: placeholderColors[idx % placeholderColors.length] }}
                  >
                    <span className="text-[10px] tracking-[0.4em] uppercase text-white/50">
                      Wide — auto height
                    </span>
                  </div>
                )}
              </div>
            );
          }

          return (
            <div
              key={`pair-${groupIdx}`}
              className={`grid grid-cols-1 md:grid-cols-2 animate-fade-up-delay-${Math.min(groupIdx + 1, 4)}`}
              style={{ gap: "10px" }}
            >
              {item.indices.map((idx) => {
                const image = imgs[idx];
                return (
                  <div
                    key={image.id}
                    className="overflow-hidden"
                  >
                    {image.url ? (
                      <img
                        src={image.url}
                        alt={image.altText ?? ""}
                        className="w-full h-auto block"
                      />
                    ) : (
                      <div
                        className="w-full aspect-[3/4] flex items-center justify-center"
                        style={{ backgroundColor: placeholderColors[idx % placeholderColors.length] }}
                      >
                        <span className="text-[10px] tracking-[0.4em] uppercase text-white/50">
                          Column — auto height
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
