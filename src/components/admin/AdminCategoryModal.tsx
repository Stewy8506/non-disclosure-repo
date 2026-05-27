import React, { useState } from "react";
import { Edit2, Trash2, X, Save } from "lucide-react";

export type PredefinedCategory = { name: string, imageType: string };

interface AdminCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  predefinedCategories: PredefinedCategory[];
  handleRenameCategory: (oldName: string, newName: string, newImageType: string) => void;
  handleDeleteCategory: (name: string) => void;
  handleAddCategory: (name: string, imageType: string) => void;
}

export default function AdminCategoryModal({
  isOpen,
  onClose,
  predefinedCategories,
  handleRenameCategory,
  handleDeleteCategory,
  handleAddCategory
}: AdminCategoryModalProps) {
  const [editingCategory, setEditingCategory] = useState<{old: string, new: string, imageType: string} | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryFrame, setNewCategoryFrame] = useState("auto");

  if (!isOpen) return null;

  const onAddClick = () => {
    handleAddCategory(newCategoryName, newCategoryFrame);
    setNewCategoryName("");
    setNewCategoryFrame("auto");
  };

  const onRenameClick = (oldName: string, newName: string, imageType: string) => {
    handleRenameCategory(oldName, newName, imageType);
    setEditingCategory(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
          <h2 className="text-lg font-semibold">Manage Predefined Categories</h2>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-3 mb-6">
            {predefinedCategories.map(cat => (
              <div key={cat.name} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-md bg-zinc-950 border border-zinc-800 gap-2">
                {editingCategory?.old === cat.name ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editingCategory.new}
                      onChange={(e) => setEditingCategory({ ...editingCategory, new: e.target.value })}
                      className="flex-1 px-2 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-sm focus:outline-none min-w-[120px]"
                    />
                    <select 
                      value={editingCategory.imageType}
                      onChange={(e) => setEditingCategory({ ...editingCategory, imageType: e.target.value })}
                      className="px-2 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-xs focus:outline-none appearance-none cursor-pointer w-28"
                    >
                      <option value="auto">Auto Frame</option>
                      <option value="desktop">Desktop</option>
                      <option value="phone">Phone</option>
                      <option value="embedded">Embedded</option>
                    </select>
                    <button onClick={() => onRenameClick(editingCategory.old, editingCategory.new, editingCategory.imageType)} className="p-1.5 bg-zinc-100 text-zinc-900 rounded hover:bg-zinc-300">
                      <Save size={14} />
                    </button>
                    <button onClick={() => setEditingCategory(null)} className="p-1.5 bg-zinc-800 text-zinc-400 rounded hover:text-white">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{cat.name}</span>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{cat.imageType === 'auto' ? 'Auto Frame' : cat.imageType}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingCategory({ old: cat.name, new: cat.name, imageType: cat.imageType })} className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800" title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDeleteCategory(cat.name)} className="p-1.5 text-zinc-400 hover:text-red-400 rounded hover:bg-zinc-800" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
            {predefinedCategories.length === 0 && <p className="text-sm text-zinc-500 text-center py-4">No predefined categories.</p>}
          </div>

          <div className="border-t border-zinc-800 pt-4">
            <label className="block text-sm text-zinc-400 mb-2">Add New Predefined Category</label>
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Hardware"
                className="flex-[2] px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-sm focus:border-zinc-600 focus:outline-none min-w-[140px]"
                onKeyDown={(e) => e.key === 'Enter' && onAddClick()}
              />
              <select 
                value={newCategoryFrame}
                onChange={(e) => setNewCategoryFrame(e.target.value)}
                className="flex-1 px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 text-sm focus:border-zinc-600 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="auto">Auto Frame</option>
                <option value="desktop">Desktop</option>
                <option value="phone">Phone</option>
                <option value="embedded">Embedded</option>
              </select>
              <button onClick={onAddClick} className="px-4 py-2 bg-zinc-800 text-white rounded-md text-sm font-medium hover:bg-zinc-700 w-full sm:w-auto">Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
