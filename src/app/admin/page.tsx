"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, LogOut, Save, ExternalLink, Upload, Image as ImageIcon, X, Search, Filter, Edit2, LayoutTemplate, Wrench, GripVertical, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import AdminCategoryModal from "@/components/admin/AdminCategoryModal";
import AdminSkillModal from "@/components/admin/AdminSkillModal";
import AdminProjectModal from "@/components/admin/AdminProjectModal";
import AdminGuestbookTab from "@/components/admin/AdminGuestbookTab";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore";
import { toast } from "@/components/ui/Toast";
import {
  DEFAULT_PROJECT_CATEGORY,
  DEFAULT_SKILL_CATEGORY,
  PROJECT_CATEGORIES,
  SKILL_CATEGORIES,
  normalizeProjectCategory,
  normalizeSkillCategory,
} from "@/lib/projects";

type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];
type SkillCategory = (typeof SKILL_CATEGORIES)[number];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"projects" | "skills" | "guestbook">("projects");
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [guestbookEntries, setGuestbookEntries] = useState<any[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
  // Projects Modal
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    overview: "",
    problem: "",
    solution: "",
    approach: "",
    learnings: "",
    liveDemoUrl: "",
    sourceCodeUrl: "",
    tech: "",
    link: "",
    category: DEFAULT_PROJECT_CATEGORY as string,
    hasLiveDemo: true,
    isCurrentlyWorkingOn: false,
    images: [] as string[],
    imageType: "auto" as "phone" | "desktop" | "embedded" | "auto",
    architectureDiagram: "",
    databaseSchema: "",
    stateManagement: "",
    challenges: [] as Array<{ title: string; description: string; solution: string }>
  });

  // Skills Modal
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState({
    name: "",
    slug: "",
    category: DEFAULT_SKILL_CATEGORY as SkillCategory,
    white: false
  });

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  type PredefinedCategory = { name: string, imageType: string };
  const [predefinedCategories, setPredefinedCategories] = useState<PredefinedCategory[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const dynamicProjectCategories = useMemo(() => {
    const categories = new Set<string>(predefinedCategories.map(c => c.name));
    projects.forEach((p: any) => {
      if (p.category) categories.add(p.category);
    });
    return Array.from(categories);
  }, [projects, predefinedCategories]);

  const [employedStatus, setEmployedStatus] = useState<boolean | null>(null);

  useEffect(() => {
    fetchProjects();
    fetchSkills();
    fetchConfig();
    fetchGuestbook();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/config");
      const data = await res.json();
      setEmployedStatus(data.employed);
      if (data.categories) {
        const parsed = data.categories.map((c: any) => typeof c === 'string' ? { name: c, imageType: "auto" } : c);
        setPredefinedCategories(parsed);
      }
    } catch (error) {
      console.error("Failed to fetch config.");
    }
  };

  const saveCategoriesConfig = async (newCategories: PredefinedCategory[]) => {
    try {
      await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories: newCategories }),
      });
      setPredefinedCategories(newCategories);
    } catch (error) {
      toast("Failed to update categories config.", "error");
    }
  };

  const handleRenameCategory = async (oldName: string, newName: string, newImageType: string) => {
    if (!newName.trim()) {
      return;
    }
    setLoading(true);
    try {
      // update projects in backend
      const res = await fetch("/api/projects/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldName, newName: newName.trim(), imageType: newImageType })
      });
      if (!res.ok) throw new Error();

      // update config
      const updatedCategories = predefinedCategories.map(c => c.name === oldName ? { name: newName.trim(), imageType: newImageType } : c);
      await saveCategoriesConfig(updatedCategories);
      
      toast(`Category updated successfully`, "success");
      await fetchProjects(); // Refresh projects list
    } catch (error) {
      toast("Failed to update category", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (name: string) => {
    if (!confirm(`Are you sure you want to remove '${name}' from predefined categories? (Projects will keep this category until edited)`)) return;
    const updatedCategories = predefinedCategories.filter(c => c.name !== name);
    await saveCategoriesConfig(updatedCategories);
    toast("Category removed from suggestions", "success");
  };

  const handleAddCategory = async (newCategoryName: string, newCategoryFrame: string) => {
    if (!newCategoryName.trim()) return;
    if (predefinedCategories.some(c => c.name === newCategoryName.trim())) {
      toast("Category already exists", "error");
      return;
    }
    const updatedCategories = [...predefinedCategories, { name: newCategoryName.trim(), imageType: newCategoryFrame }];
    await saveCategoriesConfig(updatedCategories);
    toast("Category added", "success");
  };

  const updateEmploymentStatus = async (status: boolean) => {
    setEmployedStatus(status);
    try {
      const res = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employed: status }),
      });
      if (res.ok) {
        toast(`Employment status updated successfully to ${status ? "Yes" : "No"}.`, "success");
      } else {
        toast("Failed to update employment status.", "error");
        fetchConfig();
      }
    } catch (error) {
      toast("An error occurred.", "error");
      fetchConfig();
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      toast("Failed to fetch projects.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/skills");
      const data = await res.json();
      setSkills(data);
    } catch (error) {
      toast("Failed to fetch skills.", "error");
    }
  };

  const fetchGuestbook = async () => {
    if (!db) return;
    try {
      const q = query(collection(db, "guestbook"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGuestbookEntries(entries);
    } catch (error) {
      toast("Failed to fetch guestbook.", "error");
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const projectData = {
      ...newProject,
      tech: typeof newProject.tech === 'string' ? newProject.tech.split(",").map(t => t.trim()) : newProject.tech,
    };

    const method = editingProjectId ? "PUT" : "POST";
    const url = editingProjectId ? `/api/projects/${editingProjectId}` : "/api/projects";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      if (res.ok) {
        toast(editingProjectId ? "Project updated successfully!" : "Project added successfully!", "success");
        closeProjectModal();
        await fetchProjects();
      } else {
        toast(editingProjectId ? "Failed to update project. Check admin password." : "Failed to add project. Check admin password.", "error");
      }
    } catch (error) {
      toast("An unexpected error occurred.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const method = editingSkillId ? "PUT" : "POST";
    const url = editingSkillId ? `/api/skills/${editingSkillId}` : "/api/skills";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSkill),
      });

      if (res.ok) {
        toast(editingSkillId ? "Skill updated successfully!" : "Skill added successfully!", "success");
        closeSkillModal();
        await fetchSkills();
      } else {
        toast(editingSkillId ? "Failed to update skill." : "Failed to add skill.", "error");
      }
    } catch (error) {
      toast("An unexpected error occurred.", "error");
    } finally {
      setLoading(false);
    }
  };

  const openEditProjectModal = (project: any) => {
    setEditingProjectId(project.id);
    setNewProject({
      title: project.title,
      description: project.description,
      overview: project.overview || "",
      problem: project.problem || "",
      solution: project.solution || "",
      approach: project.approach || "",
      learnings: project.learnings || "",
      liveDemoUrl: project.liveDemoUrl || "",
      sourceCodeUrl: project.sourceCodeUrl || "",
      tech: project.tech.join(", "),
      link: project.link,
      category: normalizeProjectCategory(project.category),
      hasLiveDemo: project.hasLiveDemo !== false,
      isCurrentlyWorkingOn: project.isCurrentlyWorkingOn || false,
      images: project.images || (project.image ? [project.image] : []),
      imageType: project.imageType || "auto",
      architectureDiagram: project.architectureDiagram || "",
      databaseSchema: project.databaseSchema || "",
      stateManagement: project.stateManagement || "",
      challenges: project.challenges || [],
    });
    setIsProjectModalOpen(true);
  };

  const openEditSkillModal = (skill: any) => {
    setEditingSkillId(skill.id);
    setNewSkill({
      name: skill.name,
      slug: skill.slug,
      category: normalizeSkillCategory(skill.category),
      white: skill.white,
    });
    setIsSkillModalOpen(true);
  };

  const closeProjectModal = () => {
    setIsProjectModalOpen(false);
    setEditingProjectId(null);
    setNewProject({
      title: "",
      description: "",
      overview: "",
      problem: "",
      solution: "",
      approach: "",
      learnings: "",
      liveDemoUrl: "",
      sourceCodeUrl: "",
      tech: "",
      link: "",
      category: DEFAULT_PROJECT_CATEGORY as string,
      hasLiveDemo: true,
      isCurrentlyWorkingOn: false,
      images: [],
      imageType: "auto",
      architectureDiagram: "",
      databaseSchema: "",
      stateManagement: "",
      challenges: []
    });
  };

  const closeSkillModal = () => {
    setIsSkillModalOpen(false);
    setEditingSkillId(null);
    setNewSkill({ name: "", slug: "", category: DEFAULT_SKILL_CATEGORY as SkillCategory, white: false });
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast("Project deleted successfully.", "success");
        await fetchProjects();
      } else {
        toast("Failed to delete project.", "error");
      }
    } catch (error) {
      toast("An unexpected error occurred.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/skills?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast("Skill deleted successfully.", "success");
        await fetchSkills();
      } else {
        toast("Failed to delete skill.", "error");
      }
    } catch (error) {
      toast("An unexpected error occurred.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGuestbookEntry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this guestbook entry?")) return;
    setLoading(true);
    try {
      if (db) {
        await deleteDoc(doc(db, "guestbook", id));
        toast("Guestbook entry deleted.", "success");
        await fetchGuestbook();
      }
    } catch (error) {
      toast("Failed to delete entry.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (searchQuery || categoryFilter !== "All") {
      e.preventDefault();
      return;
    }
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      handleDragEnd();
      return;
    }

    const updatedProjects = [...projects];
    const [draggedProject] = updatedProjects.splice(draggedIndex, 1);
    updatedProjects.splice(targetIndex, 0, draggedProject);

    // Optimistically update the UI list instantly
    setProjects(updatedProjects);
    handleDragEnd();
    setLoading(true);

    try {
      // Re-assign order for ALL projects to maintain consistency
      const promises = updatedProjects.map((proj: any, idx: number) => {
        return fetch(`/api/projects/${proj.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...proj, order: idx }),
        });
      });

      await Promise.all(promises);
      toast("Projects reordered successfully!", "success");
      await fetchProjects();
    } catch (error) {
      toast("Failed to save project order.", "error");
      await fetchProjects();
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast("Image size must be less than 5MB.", "error");
      return;
    }

    setUploading(true);
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset || cloudName === "your_cloud_name" || uploadPreset === "your_unsigned_upload_preset") {
        throw new Error("Missing Cloudinary configuration in .env.local.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload image to Cloudinary.");

      const data = await res.json();
      setNewProject({ ...newProject, images: [...newProject.images, data.secure_url] });
      toast("Image uploaded to Cloudinary successfully!", "success");
    } catch (error: any) {
      console.error("Cloudinary Upload Error:", error);
      toast(error.message || "Failed to upload image.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout failed", e);
    }
    router.push("/admin/login");
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((p: any) => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, categoryFilter]);

  const filteredSkills = useMemo(() => {
    return skills.filter((s: any) => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            s.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "All" || s.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [skills, searchQuery, categoryFilter]);

  const filteredGuestbook = useMemo(() => {
    return guestbookEntries.filter((entry: any) => {
      const matchesSearch = entry.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            entry.message.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [guestbookEntries, searchQuery]);

  if (loading && projects.length === 0 && skills.length === 0) return <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900 p-6 rounded-lg border border-zinc-800">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100">Admin Dashboard</h1>
            <p className="text-sm text-zinc-400">Manage your portfolio projects and configurations.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsCategoryModalOpen(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300 font-medium hover:bg-zinc-700 hover:text-white transition-colors text-sm ${activeTab === 'projects' ? '' : 'hidden'}`}
            >
              <LayoutTemplate size={16} /> Manage Categories
            </button>
            <button 
              onClick={() => activeTab === 'projects' ? setIsProjectModalOpen(true) : activeTab === 'skills' ? setIsSkillModalOpen(true) : null}
              className={`flex items-center gap-2 px-4 py-2 rounded-md bg-zinc-100 text-zinc-900 font-medium hover:bg-zinc-200 transition-colors text-sm ${activeTab === 'guestbook' ? 'hidden' : ''}`}
            >
              <Plus size={16} /> New {activeTab === 'projects' ? 'Project' : 'Skill'}
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors text-sm"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        {/* Settings Bar */}
        <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-zinc-200">Employment Status</span>
            <span className="text-xs text-zinc-400">When "No", your portfolio will show "Available for new opportunities".</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400">Employed:</span>
            <div className="inline-flex rounded-lg p-0.5 bg-zinc-950 border border-zinc-800">
              <button
                onClick={() => updateEmploymentStatus(true)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-300 ${
                  employedStatus === true
                    ? "bg-zinc-100 text-zinc-950 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => updateEmploymentStatus(false)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-300 ${
                  employedStatus === false
                    ? "bg-zinc-100 text-zinc-950 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                No
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-zinc-800 pb-2">
          <button 
            onClick={() => { setActiveTab("projects"); setCategoryFilter("All"); setSearchQuery(""); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === "projects" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            <LayoutTemplate size={16} /> Projects
          </button>
          <button 
            onClick={() => { setActiveTab("skills"); setCategoryFilter("All"); setSearchQuery(""); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === "skills" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            <Wrench size={16} /> Skills
          </button>
          <button 
            onClick={() => { setActiveTab("guestbook"); setCategoryFilter("All"); setSearchQuery(""); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${activeTab === "guestbook" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            <MessageSquare size={16} /> Guestbook
          </button>
        </div>

        {/* Toolbar: Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 bg-zinc-900 p-4 rounded-lg border border-zinc-800">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-sm focus:border-zinc-600 focus:outline-none transition-colors"
            />
          </div>
          <div className="relative w-full sm:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-sm focus:border-zinc-600 focus:outline-none transition-colors appearance-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              {activeTab === "projects" ? (
                <>
                  {dynamicProjectCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </>
              ) : activeTab === "skills" ? (
                <>
                  {SKILL_CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </>
              ) : null}
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            {activeTab === "projects" ? (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-zinc-950/50 border-b border-zinc-800 text-zinc-400">
                  <tr>
                    <th className="px-4 py-4 font-medium w-10"></th>
                    <th className="px-6 py-4 font-medium w-16">Image</th>
                    <th className="px-6 py-4 font-medium">Project Name</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Tech Stack</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {filteredProjects.map((project: any, index: number) => {
                    const isDraggable = !searchQuery && categoryFilter === "All";
                    return (
                      <tr 
                        key={project.id || project.title} 
                        draggable={isDraggable}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`hover:bg-zinc-800/20 transition-all duration-200 border-l-2 select-none ${
                          draggedIndex === index
                            ? "bg-zinc-900/60 border-l-zinc-500 opacity-40 scale-[0.99]"
                            : dragOverIndex === index
                            ? "bg-zinc-800/30 border-l-zinc-300"
                            : "border-l-transparent"
                        }`}
                      >
                        <td className="px-4 py-3 text-zinc-500 w-10">
                          {isDraggable ? (
                            <div className="cursor-grab active:cursor-grabbing hover:text-zinc-300 p-1 flex items-center justify-center">
                              <GripVertical size={16} />
                            </div>
                          ) : (
                            <div className="text-zinc-700 p-1 flex items-center justify-center opacity-30 cursor-not-allowed" title="Clear filters/search to drag and drop">
                              <GripVertical size={16} />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-3">
                          <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-700">
                            {project.images?.length > 0 || project.image ? (
                              <img src={project.images?.[0] || project.image} alt={project.title} className="w-full h-full object-cover" />
                            ) : (
                              <span className="font-bold text-zinc-500">{project.title[0]}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <p className="font-medium text-zinc-100">{project.title}</p>
                          <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline flex items-center gap-1 mt-0.5 w-max">
                            View Link <ExternalLink size={10} />
                          </a>
                        </td>
                        <td className="px-6 py-3 text-zinc-300">{project.category}</td>
                        <td className="px-6 py-3">
                          <div className="flex gap-1 flex-wrap w-48 truncate">
                            {project.tech.map((t: string) => (
                              <span key={t} className="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-300">
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => openEditProjectModal(project)}
                              className="p-1.5 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              onClick={() => handleDeleteProject(project.id)}
                              className="p-1.5 rounded-md bg-red-950/30 border border-red-900/50 text-red-400 hover:bg-red-900/50 hover:text-red-300 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredProjects.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                        No projects found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : activeTab === "skills" ? (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-zinc-950/50 border-b border-zinc-800 text-zinc-400">
                  <tr>
                    <th className="px-6 py-4 font-medium w-16">Icon</th>
                    <th className="px-6 py-4 font-medium">Skill Name</th>
                    <th className="px-6 py-4 font-medium">Slug</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {filteredSkills.map((skill: any) => (
                    <tr key={skill.id || skill.slug} className="hover:bg-zinc-800/20 transition-colors">
                      <td className="px-6 py-3">
                        <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center p-1.5 overflow-hidden border border-zinc-700">
                          <img 
                            src={`https://cdn.simpleicons.org/${skill.slug}${skill.white ? '/white' : ''}`} 
                            alt={skill.name}
                            className="w-full h-full object-contain"
                            onError={(e) => (e.currentTarget.src = "/favicon.ico")} // fallback
                          />
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <p className="font-medium text-zinc-100">{skill.name}</p>
                      </td>
                      <td className="px-6 py-3 text-zinc-400">{skill.slug}</td>
                      <td className="px-6 py-3 text-zinc-300">{skill.category}</td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => openEditSkillModal(skill)}
                            className="p-1.5 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteSkill(skill.id)}
                            className="p-1.5 rounded-md bg-red-950/30 border border-red-900/50 text-red-400 hover:bg-red-900/50 hover:text-red-300 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredSkills.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                        No skills found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <AdminGuestbookTab 
                filteredGuestbook={filteredGuestbook} 
                handleDeleteGuestbookEntry={handleDeleteGuestbookEntry} 
              />
            )}
          </div>
        </div>
      </div>

      <AdminProjectModal
        isOpen={isProjectModalOpen}
        onClose={closeProjectModal}
        editingProjectId={editingProjectId}
        newProject={newProject}
        setNewProject={setNewProject}
        handleSaveProject={handleSaveProject}
        loading={loading}
        uploading={uploading}
        handleImageUpload={handleImageUpload}
        dynamicProjectCategories={dynamicProjectCategories}
      />

      <AdminSkillModal
        isOpen={isSkillModalOpen}
        onClose={closeSkillModal}
        editingSkillId={editingSkillId}
        newSkill={newSkill}
        setNewSkill={setNewSkill}
        handleSaveSkill={handleSaveSkill}
        loading={loading}
      />
      <AdminCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        predefinedCategories={predefinedCategories}
        handleRenameCategory={handleRenameCategory}
        handleDeleteCategory={handleDeleteCategory}
        handleAddCategory={handleAddCategory}
      />
    </div>
  );
}
