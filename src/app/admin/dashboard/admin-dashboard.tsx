"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface GalleryImage {
  id?: string;
  url: string;
  altText: string;
  order: number;
  layout: "wide" | "column";
}

interface Project {
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

const EMPTY_FORM = {
  title: "",
  client: "",
  description: "",
  coverImage: "",
  date: "",
  slug: "",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Upload failed");
  }
  const data = await res.json();
  return data.url;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "form">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/works");
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      const data = await res.json();
      setProjects(data);
    } catch {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [router]);

  async function handleReorder(reordered: Project[]) {
    setProjects(reordered);
    try {
      await fetch("/api/works/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: reordered.map((p) => p.id) }),
      });
    } catch {
      setError("Failed to save order");
    }
  }

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setImages([]);
    setError("");
    setSuccess("");
    setView("form");
  }

  function openEdit(project: Project) {
    setEditingId(project.id);
    setForm({
      title: project.title,
      client: project.client ?? "",
      description: project.description ?? "",
      coverImage: project.coverImage ?? "",
      date: project.date ? project.date.slice(0, 10) : "",
      slug: project.slug,
    });
    setImages(
      project.images.map((img) => ({
        id: img.id,
        url: img.url,
        altText: img.altText ?? "",
        order: img.order,
        layout: (img.layout as "wide" | "column") ?? "column",
      }))
    );
    setError("");
    setSuccess("");
    setView("form");
  }

  async function handleSave() {
    setError("");
    setSuccess("");
    setSaving(true);

    const payload = {
      ...form,
      images: images.map((img, i) => ({
        url: img.url,
        altText: img.altText || null,
        order: i,
        layout: img.layout,
      })),
    };

    try {
      const url = editingId ? `/api/works/${editingId}` : "/api/works";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Save failed");
        return;
      }

      setSuccess(editingId ? "Project updated!" : "Project created!");
      await fetchProjects();
      setTimeout(() => {
        setSuccess("");
        setView("list");
      }, 1000);
    } catch {
      setError("Connection error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/works/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setError("Delete failed");
        return;
      }
      setDeleteConfirm(null);
      setSuccess("Project deleted");
      await fetchProjects();
      setTimeout(() => setSuccess(""), 2000);
    } catch {
      setError("Connection error");
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Top bar */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="flex items-center justify-between py-4 max-w-6xl mx-auto" style={{ paddingLeft: "48px", paddingRight: "48px" }}>
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-foreground">Portfolio Admin</h1>
            <span className="text-sm text-muted">
              {view === "list" ? "" : editingId ? "/ Edit Project" : "/ New Project"}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm text-muted">
              {projects.length} {projects.length === 1 ? "project" : "projects"}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="py-8 max-w-6xl mx-auto" style={{ paddingLeft: "48px", paddingRight: "48px" }}>
        {/* Notifications */}
        {error && (
          <div className="mb-6 flex items-center justify-between bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <span className="text-sm text-red-600">{error}</span>
            <button onClick={() => setError("")} className="text-red-400 hover:text-red-600 text-lg">&times;</button>
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            <span className="text-sm text-green-600">{success}</span>
          </div>
        )}

        {view === "list" ? (
          <ProjectList
            projects={projects}
            loading={loading}
            onEdit={openEdit}
            onDelete={(id) => setDeleteConfirm(id)}
            onCreate={openCreate}
            onReorder={handleReorder}
            deleteConfirm={deleteConfirm}
            onDeleteConfirm={handleDelete}
            onDeleteCancel={() => setDeleteConfirm(null)}
          />
        ) : (
          <ProjectForm
            form={form}
            setForm={setForm}
            images={images}
            setImages={setImages}
            isEditing={!!editingId}
            saving={saving}
            onSave={handleSave}
            onCancel={() => { setView("list"); setError(""); setSuccess(""); }}
            onError={setError}
          />
        )}
      </div>
    </div>
  );
}

function ProjectList({
  projects,
  loading,
  onEdit,
  onDelete,
  onCreate,
  onReorder,
  deleteConfirm,
  onDeleteConfirm,
  onDeleteCancel,
}: {
  projects: Project[];
  loading: boolean;
  onEdit: (p: Project) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  onReorder: (projects: Project[]) => void;
  deleteConfirm: string | null;
  onDeleteConfirm: (id: string) => void;
  onDeleteCancel: () => void;
}) {
  const dragItem = useRef<number | null>(null);
  const dragOver = useRef<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  function handleDragStart(index: number) {
    dragItem.current = index;
    setDragging(index);
  }

  function handleDragEnter(index: number) {
    dragOver.current = index;
    setDragOverIdx(index);
  }

  function handleDragEnd() {
    if (dragItem.current === null || dragOver.current === null) {
      setDragging(null);
      setDragOverIdx(null);
      return;
    }
    const next = [...projects];
    const [dragged] = next.splice(dragItem.current, 1);
    next.splice(dragOver.current, 0, dragged);
    dragItem.current = null;
    dragOver.current = null;
    setDragging(null);
    setDragOverIdx(null);
    onReorder(next);
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={onCreate}
          className="flex items-center gap-2 bg-foreground text-background font-semibold text-sm rounded-lg px-5 py-2.5 hover:opacity-90 transition-opacity"
        >
          <span className="text-lg leading-none">+</span> New Project
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-border p-16 text-center">
          <p className="text-sm text-muted">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-16 text-center">
          <div className="text-4xl mb-4">📷</div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No projects yet</h3>
          <p className="text-sm text-muted mb-6">Start building your portfolio by adding your first project.</p>
          <button
            onClick={onCreate}
            className="bg-foreground text-background font-semibold text-sm rounded-lg px-6 py-2.5 hover:opacity-90 transition-opacity"
          >
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="grid" style={{ gap: "24px" }}>
          {projects.map((project, i) => (
            <div
              key={project.id}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragEnter={() => handleDragEnter(i)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={`bg-white rounded-xl border flex items-center transition-all ${
                dragging === i
                  ? "opacity-40 border-foreground/30"
                  : dragOverIdx === i && dragging !== null
                  ? "border-foreground/40 shadow-md"
                  : "border-border hover:shadow-sm"
              }`}
              style={{ padding: "24px", gap: "24px" }}
            >
              {/* Drag handle */}
              <div className="cursor-grab active:cursor-grabbing text-muted hover:text-foreground transition-colors select-none shrink-0">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="4" cy="3" r="1.5" />
                  <circle cx="12" cy="3" r="1.5" />
                  <circle cx="4" cy="8" r="1.5" />
                  <circle cx="12" cy="8" r="1.5" />
                  <circle cx="4" cy="13" r="1.5" />
                  <circle cx="12" cy="13" r="1.5" />
                </svg>
              </div>

              {/* Thumbnail */}
              {project.coverImage ? (
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-24 h-24 rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="w-24 h-24 rounded-lg bg-[#f0f0ee] shrink-0 flex items-center justify-center">
                  <span className="text-2xl">🖼</span>
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-foreground truncate">
                  {project.title}
                </h3>
                <p className="text-sm text-muted" style={{ marginTop: "8px" }}>
                  {project.description ?? project.client ?? ""}
                </p>
                <p className="text-xs text-muted/60" style={{ marginTop: "8px" }}>
                  {project.images.length} photo{project.images.length !== 1 && "s"}
                  {project.date && ` · ${new Date(project.date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}`}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {deleteConfirm === project.id ? (
                  <>
                    <span className="text-sm text-red-500 mr-2">Delete this project?</span>
                    <button
                      onClick={() => onDeleteConfirm(project.id)}
                      className="text-sm font-semibold text-red-500 hover:text-red-600 bg-red-50 rounded-lg px-3 py-1.5 transition-colors"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={onDeleteCancel}
                      className="text-sm text-muted hover:text-foreground bg-[#f5f5f3] rounded-lg px-3 py-1.5 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => onEdit(project)}
                      className="text-sm font-medium text-foreground bg-[#f5f5f3] hover:bg-[#eaeaea] rounded-lg px-4 py-1.5 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(project.id)}
                      className="text-sm text-muted hover:text-red-500 rounded-lg px-3 py-1.5 transition-colors"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectForm({
  form,
  setForm,
  images,
  setImages,
  isEditing,
  saving,
  onSave,
  onCancel,
  onError,
}: {
  form: typeof EMPTY_FORM;
  setForm: (f: typeof EMPTY_FORM) => void;
  images: GalleryImage[];
  setImages: (imgs: GalleryImage[]) => void;
  isEditing: boolean;
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
  onError: (msg: string) => void;
}) {
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  function updateField(field: string, value: string) {
    const next = { ...form, [field]: value };
    if (!isEditing && (field === "title" || field === "description")) {
      const title = field === "title" ? value : form.title;
      const subtitle = field === "description" ? value : form.description;
      next.slug = slugify(subtitle ? `${title} ${subtitle}` : title);
    }
    setForm(next);
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setForm({ ...form, coverImage: url });
    } catch (err) {
      onError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const newImages: GalleryImage[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadFile(file);
        newImages.push({
          url,
          altText: file.name.replace(/\.[^.]+$/, ""),
          order: images.length + newImages.length,
          layout: "column",
        });
      }
      setImages([...images, ...newImages]);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  }

  function updateImage(index: number, field: "url" | "altText" | "layout", value: string) {
    const next = [...images];
    next[index] = { ...next[index], [field]: value };
    setImages(next);
  }

  function toggleLayout(index: number) {
    const next = [...images];
    next[index] = { ...next[index], layout: next[index].layout === "wide" ? "column" : "wide" };
    setImages(next);
  }

  function removeImage(index: number) {
    setImages(images.filter((_, i) => i !== index));
  }

  function useCoverFromFirst() {
    if (images.length > 0 && images[0].url) {
      setForm({ ...form, coverImage: images[0].url });
    }
  }

  return (
    <div>
      {/* Top bar with back button and save button */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
        >
          ← Back to Projects
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={onSave}
            disabled={saving || uploading || !form.title || !form.slug}
            className="bg-foreground text-background font-semibold text-sm rounded-lg px-8 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : isEditing ? "Save Changes" : "Create Project"}
          </button>
          <button
            onClick={onCancel}
            className="text-sm text-muted hover:text-foreground transition-colors px-4 py-2.5"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Upload indicator */}
      {uploading && (
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
          <span className="text-sm text-blue-600">Uploading image...</span>
        </div>
      )}

      {/* Project Details Card */}
      <div className="bg-white rounded-xl border border-border p-6 md:p-8 mb-8">
        <h2 className="text-lg font-bold text-foreground mb-8">
          {isEditing ? "Edit Project" : "New Project"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          <InputField
            label="Project Title"
            required
            value={form.title}
            onChange={(v) => updateField("title", v)}
            placeholder="e.g. Silence Between Frames"
          />
          <InputField
            label="URL Slug"
            required
            value={form.slug}
            onChange={(v) => updateField("slug", v)}
            placeholder="auto-generated-from-title"
            mono
          />
          <InputField
            label="Client"
            value={form.client}
            onChange={(v) => updateField("client", v)}
            placeholder="e.g. Vogue Italia (or leave empty for Personal)"
          />
          <InputField
            label="Date"
            type="date"
            value={form.date}
            onChange={(v) => updateField("date", v)}
          />
          <div /> {/* spacer */}
        </div>

        <div className="mt-8">
          <InputField
            label="Subtitle"
            value={form.description}
            onChange={(v) => updateField("description", v)}
            placeholder="e.g. FW 2019, Spring Campaign, Personal Work"
          />
        </div>
      </div>

      {/* Cover Image Card */}
      <div className="bg-white rounded-xl border border-border p-6 md:p-8 mb-8">
        <h2 className="text-lg font-bold text-foreground mb-6">Cover Image</h2>

        {form.coverImage ? (
          <div className="mb-6">
            <img
              src={form.coverImage}
              alt="Cover preview"
              className="w-full max-w-md h-48 object-cover rounded-lg border border-border"
            />
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            disabled={uploading}
            className="text-sm font-medium bg-[#f5f5f3] hover:bg-[#eaeaea] rounded-lg px-4 py-2 transition-colors disabled:opacity-30"
          >
            {form.coverImage ? "Change Image" : "Upload Cover Image"}
          </button>
          {images.length > 0 && (
            <button
              type="button"
              onClick={useCoverFromFirst}
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Use first gallery image
            </button>
          )}
          {form.coverImage && (
            <button
              type="button"
              onClick={() => setForm({ ...form, coverImage: "" })}
              className="text-sm text-red-400 hover:text-red-500 transition-colors"
            >
              Remove
            </button>
          )}
        </div>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={handleCoverUpload}
          className="hidden"
        />
      </div>

      {/* Gallery Images Card */}
      <div className="bg-white rounded-xl border border-border p-6 md:p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">Gallery Images</h2>
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            disabled={uploading}
            className="text-xl font-bold text-muted hover:text-foreground bg-[#f5f5f3] hover:bg-[#eaeaea] rounded-lg transition-colors disabled:opacity-30"
            style={{ width: "36px", height: "36px", lineHeight: "1" }}
          >
            +
          </button>
        </div>

        {images.length === 0 ? (
          <div className="border-2 border-dashed border-border rounded-xl p-12 text-center">
            <div className="text-3xl mb-3">📷</div>
            <p className="text-sm font-medium text-foreground mb-1">No photos yet</p>
            <p className="text-sm text-muted mb-4">Upload images to build your gallery</p>
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              disabled={uploading}
              className="text-sm font-semibold bg-foreground text-background rounded-lg px-5 py-2 hover:opacity-90 transition-opacity disabled:opacity-30"
            >
              Upload Images
            </button>
          </div>
        ) : (
          <ImageList
            images={images}
            onChange={setImages}
            onUpdate={updateImage}
            onRemove={removeImage}
            onToggleLayout={toggleLayout}
          />
        )}
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleGalleryUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}


function ImageList({
  images,
  onChange,
  onUpdate,
  onRemove,
  onToggleLayout,
}: {
  images: GalleryImage[];
  onChange: (imgs: GalleryImage[]) => void;
  onUpdate: (i: number, field: "url" | "altText" | "layout", value: string) => void;
  onRemove: (i: number) => void;
  onToggleLayout: (i: number) => void;
}) {
  const dragItem = useRef<number | null>(null);
  const dragOver = useRef<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  function handleDragStart(index: number) {
    dragItem.current = index;
    setDragging(index);
  }

  function handleDragEnter(index: number) {
    dragOver.current = index;
    setDragOverIdx(index);
  }

  function handleDragEnd() {
    if (dragItem.current === null || dragOver.current === null) {
      setDragging(null);
      setDragOverIdx(null);
      return;
    }
    const next = [...images];
    const [dragged] = next.splice(dragItem.current, 1);
    next.splice(dragOver.current, 0, dragged);
    dragItem.current = null;
    dragOver.current = null;
    setDragging(null);
    setDragOverIdx(null);
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {images.map((img, i) => (
        <div
          key={i}
          draggable
          onDragStart={() => handleDragStart(i)}
          onDragEnter={() => handleDragEnter(i)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => e.preventDefault()}
          className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
            dragging === i
              ? "opacity-40 border-foreground/30 bg-[#f0f0ee]"
              : dragOverIdx === i && dragging !== null
              ? "border-foreground/40 bg-[#f5f5f3]"
              : "border-border bg-white hover:bg-[#fafafa]"
          }`}
        >
          {/* Drag handle */}
          <div className="cursor-grab active:cursor-grabbing text-muted hover:text-foreground transition-colors select-none shrink-0 px-1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="4" cy="3" r="1.5" />
              <circle cx="12" cy="3" r="1.5" />
              <circle cx="4" cy="8" r="1.5" />
              <circle cx="12" cy="8" r="1.5" />
              <circle cx="4" cy="13" r="1.5" />
              <circle cx="12" cy="13" r="1.5" />
            </svg>
          </div>

          {/* Position number */}
          <span className="text-sm font-bold text-foreground w-6 text-center shrink-0">
            {i + 1}
          </span>

          {/* Thumbnail */}
          <img
            src={img.url}
            alt={img.altText || `Image ${i + 1}`}
            className="w-14 h-14 rounded object-cover shrink-0 border border-border"
          />

          {/* Info + caption */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <button
                type="button"
                onClick={() => onToggleLayout(i)}
                className={`text-xs font-semibold px-2 py-0.5 rounded transition-colors ${
                  img.layout === "wide"
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    : "bg-[#f5f5f3] text-foreground/60 hover:bg-[#eaeaea]"
                }`}
              >
                {img.layout === "wide" ? "Wide" : "Column"}
              </button>
            </div>
            <input
              type="text"
              value={img.altText}
              onChange={(e) => onUpdate(i, "altText", e.target.value)}
              placeholder="Add a caption..."
              className="w-full text-sm text-foreground bg-transparent outline-none placeholder-muted/50"
            />
          </div>

          {/* Remove button */}
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="text-sm text-muted hover:text-red-500 transition-colors shrink-0 px-2"
            title="Remove image"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

function InputField({
  label,
  required,
  value,
  onChange,
  placeholder,
  type = "text",
  mono,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  mono?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-white border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:border-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all ${mono ? "font-mono text-xs" : ""}`}
      />
    </div>
  );
}
