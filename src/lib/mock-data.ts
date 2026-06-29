export interface Project {
  id: string;
  title: string;
  client: string | null;
  category: string | null;
  description: string | null;
  coverImage: string | null;
  date: string | null;
  slug: string;
  createdAt: string;
  images: GalleryImage[];
}

export interface GalleryImage {
  id: string;
  url: string;
  altText: string | null;
  order: number;
  projectId: string;
}

export const projects: Project[] = [
  {
    id: "1",
    title: "Silence Between Frames",
    client: "Vogue Italia",
    category: "Editorial",
    description:
      "An exploration of stillness in motion — captured across three days in the abandoned textile mills of Biella. The series examines the tension between industrial decay and the human form, drawing parallels between the machinery's ceased rhythm and the deliberate pause of each pose.",
    coverImage: null,
    date: "2025-11-15",
    slug: "silence-between-frames",
    createdAt: "2025-11-20T00:00:00Z",
    images: [
      { id: "1a", url: "", altText: "Model in abandoned mill, natural light through broken windows", order: 0, projectId: "1" },
      { id: "1b", url: "", altText: "Silhouette against industrial backdrop", order: 1, projectId: "1" },
      { id: "1c", url: "", altText: "Close-up portrait with machinery shadows", order: 2, projectId: "1" },
      { id: "1d", url: "", altText: "Wide shot, figure among looms", order: 3, projectId: "1" },
    ],
  },
  {
    id: "2",
    title: "Meridian",
    client: "Dazed",
    category: "Fashion",
    description:
      "Shot during the golden hour across the salt flats of Uyuni, Meridian captures the intersection of raw landscape and haute couture. The reflective surfaces create an infinite horizon where garment and geography become indistinguishable.",
    coverImage: null,
    date: "2025-09-03",
    slug: "meridian",
    createdAt: "2025-09-10T00:00:00Z",
    images: [
      { id: "2a", url: "", altText: "Figure on salt flat at golden hour", order: 0, projectId: "2" },
      { id: "2b", url: "", altText: "Reflection on water surface", order: 1, projectId: "2" },
      { id: "2c", url: "", altText: "Wide landscape with solitary figure", order: 2, projectId: "2" },
    ],
  },
  {
    id: "3",
    title: "Concrete Pastoral",
    client: "AnOther Magazine",
    category: "Editorial",
    description:
      "A visual essay on the quiet beauty found in brutalist architecture across Marseille's Unité d'Habitation. The series pairs soft organic styling against Le Corbusier's unforgiving geometries.",
    coverImage: null,
    date: "2025-06-20",
    slug: "concrete-pastoral",
    createdAt: "2025-06-25T00:00:00Z",
    images: [
      { id: "3a", url: "", altText: "Portrait against concrete facade", order: 0, projectId: "3" },
      { id: "3b", url: "", altText: "Figure in brutalist corridor", order: 1, projectId: "3" },
      { id: "3c", url: "", altText: "Geometric shadows on model", order: 2, projectId: "3" },
      { id: "3d", url: "", altText: "Rooftop terrace, late afternoon light", order: 3, projectId: "3" },
      { id: "3e", url: "", altText: "Detail shot, fabric and concrete", order: 4, projectId: "3" },
    ],
  },
  {
    id: "4",
    title: "Nocturne",
    client: "i-D",
    category: "Fashion",
    description:
      "A nocturnal study in Tokyo's Shinjuku district. Neon becomes the sole light source, casting the collection in chromatic distortion. Each frame is a collaboration between the city's electric pulse and the stillness of couture.",
    coverImage: null,
    date: "2025-03-12",
    slug: "nocturne",
    createdAt: "2025-03-18T00:00:00Z",
    images: [
      { id: "4a", url: "", altText: "Neon-lit portrait in Shinjuku", order: 0, projectId: "4" },
      { id: "4b", url: "", altText: "Motion blur on rain-slicked street", order: 1, projectId: "4" },
      { id: "4c", url: "", altText: "Close-up through rain-spotted glass", order: 2, projectId: "4" },
    ],
  },
  {
    id: "5",
    title: "Terra Nullius",
    client: null,
    category: "Personal",
    description:
      "An ongoing personal project documenting the landscapes of Iceland's interior highlands — places that resist human narrative. No models, no styling. Only the land as it insists on being seen.",
    coverImage: null,
    date: "2024-08-01",
    slug: "terra-nullius",
    createdAt: "2024-08-15T00:00:00Z",
    images: [
      { id: "5a", url: "", altText: "Highland plateau under overcast sky", order: 0, projectId: "5" },
      { id: "5b", url: "", altText: "Volcanic terrain at dawn", order: 1, projectId: "5" },
      { id: "5c", url: "", altText: "Glacial river from above", order: 2, projectId: "5" },
      { id: "5d", url: "", altText: "Moss-covered lava fields", order: 3, projectId: "5" },
    ],
  },
  {
    id: "6",
    title: "Second Skin",
    client: "Document Journal",
    category: "Editorial",
    description:
      "A meditation on identity and transformation through the lens of prosthetic makeup and sculptural fashion. Shot in a single white studio over 72 hours, the series strips away context to focus entirely on the metamorphosis of the body.",
    coverImage: null,
    date: "2024-12-05",
    slug: "second-skin",
    createdAt: "2024-12-10T00:00:00Z",
    images: [
      { id: "6a", url: "", altText: "Studio portrait, sculptural headpiece", order: 0, projectId: "6" },
      { id: "6b", url: "", altText: "Abstract body form, high contrast", order: 1, projectId: "6" },
      { id: "6c", url: "", altText: "Detail of prosthetic texture", order: 2, projectId: "6" },
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
