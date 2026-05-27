import React from "react";
import { X, Save } from "lucide-react";
import { SKILL_CATEGORIES, normalizeSkillCategory } from "@/lib/projects";

interface AdminSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingSkillId: string | null;
  newSkill: { name: string; slug: string; category: string; white: boolean };
  setNewSkill: (skill: any) => void;
  handleSaveSkill: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function AdminSkillModal({
  isOpen,
  onClose,
  editingSkillId,
  newSkill,
  setNewSkill,
  handleSaveSkill,
  loading
}: AdminSkillModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg w-full max-w-sm shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
          <h2 className="text-lg font-semibold">{editingSkillId ? "Edit Skill" : "Add New Skill"}</h2>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <form id="skill-form" onSubmit={handleSaveSkill} className="space-y-4 text-sm">
            <div>
              <label className="block text-zinc-400 mb-1">Name</label>
              <input 
                type="text" 
                value={newSkill.name}
                onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors"
                placeholder="e.g., React.js"
                required
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">SimpleIcons Slug</label>
              <input 
                type="text" 
                value={newSkill.slug}
                onChange={(e) => setNewSkill({...newSkill, slug: e.target.value})}
                className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors"
                placeholder="e.g., react"
                required
              />
              <p className="text-[10px] text-zinc-500 mt-1">Find slugs at <a href="https://simpleicons.org" target="_blank" className="underline hover:text-blue-400">simpleicons.org</a></p>
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">Category</label>
              <select 
                value={newSkill.category}
                onChange={(e) => setNewSkill({...newSkill, category: normalizeSkillCategory(e.target.value)})}
                className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors appearance-none"
              >
                {SKILL_CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input 
                type="checkbox" 
                id="white-icon"
                checked={newSkill.white}
                onChange={(e) => setNewSkill({...newSkill, white: e.target.checked})}
                className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 checked:bg-zinc-100"
              />
              <label htmlFor="white-icon" className="text-zinc-400 cursor-pointer">Use White Icon (for dark background)</label>
            </div>
          </form>
        </div>
        
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-zinc-800 text-zinc-300 font-medium hover:bg-zinc-700 transition-colors text-sm border border-zinc-700">Cancel</button>
          <button type="submit" form="skill-form" disabled={loading} className="px-4 py-2 rounded-md bg-zinc-100 text-zinc-900 font-medium hover:bg-zinc-200 transition-colors text-sm disabled:opacity-50 flex items-center gap-2">
            <Save size={14} /> {editingSkillId ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
