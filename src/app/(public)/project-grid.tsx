import Link from "next/link";

interface Project {
  id: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  slug: string;
}

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="columns-2 lg:columns-3" style={{ columnGap: "10px" }}>
      {projects.map((project, i) => (
        <div
          key={project.id}
          style={{ marginBottom: "10px" }}
          className={`group relative inline-block w-full align-top break-inside-avoid animate-fade-up-delay-${Math.min(i + 1, 4)}`}
        >
          {project.coverImage ? (
            <>
              {/* Pure-CSS toggle: radios share one name so only one cover's name shows at a time */}
              <input type="radio" name="cover-reveal" id={`cover-${project.id}`} className="cover-toggle" />
              <Link
                href={`/works/${project.slug}`}
                className="cover-link block relative overflow-hidden"
              >
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="cover-overlay absolute inset-0 flex flex-col items-center justify-center text-center px-4 bg-black/40">
                  <h2 className="font-bold" style={{ color: "#ffffff", fontSize: "clamp(15px, 3.4vw, 30px)" }}>
                    {project.title}
                  </h2>
                  {project.description && (
                    <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "clamp(12px, 2.5vw, 18px)", marginTop: "5px" }}>
                      {project.description}
                    </p>
                  )}
                </div>
              </Link>
              {/* Mobile-only tap target: catches the first tap (reveal), then disappears so the second tap opens the project */}
              <label
                htmlFor={`cover-${project.id}`}
                aria-label={`Show ${project.title}`}
                className="cover-tap-target"
              />
            </>
          ) : (
            <div className="relative overflow-hidden">
              <div className="w-full aspect-[3/4] bg-[#e0e0de]" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
