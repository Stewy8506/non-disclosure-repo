import React, { useState } from "react";
import { X, Save, Upload, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Trash2, Plus } from "lucide-react";
import { toast } from "@/components/ui/Toast";

interface AdminProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProjectId: string | null;
  newProject: any;
  setNewProject: (project: any) => void;
  handleSaveProject: (e: React.FormEvent) => void;
  loading: boolean;
  uploading: boolean;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dynamicProjectCategories: string[];
}

export default function AdminProjectModal({
  isOpen,
  onClose,
  editingProjectId,
  newProject,
  setNewProject,
  handleSaveProject,
  loading,
  uploading,
  handleImageUpload,
  dynamicProjectCategories
}: AdminProjectModalProps) {
  const [showArchitecture, setShowArchitecture] = useState(false);
  const [challengeInput, setChallengeInput] = useState({ title: "", description: "", solution: "" });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
          <h2 className="text-lg font-semibold">{editingProjectId ? "Edit Project" : "Add New Project"}</h2>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <form id="project-form" onSubmit={handleSaveProject} className="space-y-4 text-sm">
            <div>
              <label className="block text-zinc-400 mb-1">Title</label>
              <input 
                type="text" 
                value={newProject.title || ""}
                onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">Description</label>
              <textarea 
                value={newProject.description || ""}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors h-24 resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">Overview</label>
              <textarea 
                value={newProject.overview || ""}
                onChange={(e) => setNewProject({...newProject, overview: e.target.value})}
                className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors h-24 resize-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">The Problem</label>
              <textarea 
                value={newProject.problem || ""}
                onChange={(e) => setNewProject({...newProject, problem: e.target.value})}
                className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors h-24 resize-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">The Solution</label>
              <textarea 
                value={newProject.solution || ""}
                onChange={(e) => setNewProject({...newProject, solution: e.target.value})}
                className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors h-24 resize-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">The Approach</label>
              <textarea 
                value={newProject.approach || ""}
                onChange={(e) => setNewProject({...newProject, approach: e.target.value})}
                className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors h-24 resize-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">Key Learnings</label>
              <textarea 
                value={newProject.learnings || ""}
                onChange={(e) => setNewProject({...newProject, learnings: e.target.value})}
                className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors h-24 resize-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">Tech Stack (comma separated)</label>
              <input 
                type="text" 
                value={newProject.tech || ""}
                onChange={(e) => setNewProject({...newProject, tech: e.target.value})}
                className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors"
                placeholder="React, Next.js, Tailwind"
                required
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">Project Link</label>
              <input 
                type="url" 
                value={newProject.link || ""}
                onChange={(e) => setNewProject({...newProject, link: e.target.value})}
                className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">Live Demo URL</label>
              <input 
                type="url" 
                value={newProject.liveDemoUrl || ""}
                onChange={(e) => setNewProject({...newProject, liveDemoUrl: e.target.value})}
                className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-zinc-400 mb-4 cursor-pointer mt-2 w-fit">
                <input 
                  type="checkbox" 
                  checked={!!newProject.hasLiveDemo}
                  onChange={(e) => setNewProject({...newProject, hasLiveDemo: e.target.checked})}
                  className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-white focus:ring-0 focus:ring-offset-0 cursor-pointer accent-white"
                />
                <span>Has Live Demo / Live Site link?</span>
              </label>
              <label className="flex items-center gap-2 text-zinc-400 mb-4 cursor-pointer mt-2 w-fit">
                <input 
                  type="checkbox" 
                  checked={!!newProject.isCurrentlyWorkingOn}
                  onChange={(e) => setNewProject({...newProject, isCurrentlyWorkingOn: e.target.checked})}
                  className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-white focus:ring-0 focus:ring-offset-0 cursor-pointer accent-white"
                />
                <span>Currently Working On?</span>
              </label>
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">Source Code URL</label>
              <input 
                type="url" 
                value={newProject.sourceCodeUrl || ""}
                onChange={(e) => setNewProject({...newProject, sourceCodeUrl: e.target.value})}
                className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">Category</label>
              <input 
                type="text"
                list="project-categories"
                value={newProject.category || ""}
                onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors"
              />
              <datalist id="project-categories">
                {dynamicProjectCategories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">Mockup Type</label>
              <select 
                value={newProject.imageType || "auto"}
                onChange={(e) => setNewProject({...newProject, imageType: e.target.value as any})}
                className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors appearance-none"
              >
                <option value="auto">Auto (Infer from category)</option>
                <option value="desktop">Desktop / Laptop</option>
                <option value="phone">Mobile / Phone</option>
                <option value="embedded">Embedded Photo Frame</option>
              </select>
            </div>
            <div>
              <label className="block text-zinc-400 mb-2">Project Images</label>
              <div className="flex flex-wrap gap-4 items-start">
                {newProject.images?.map((img: string, idx: number) => (
                  <div key={idx} className="relative h-20 w-20 rounded-md bg-zinc-950 border border-zinc-800 overflow-hidden flex-shrink-0 group">
                    <img 
                      src={img} 
                      alt={`Preview ${idx + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1">
                      <div className="flex justify-end w-full">
                        <button
                          type="button"
                          onClick={() => setNewProject({ ...newProject, images: newProject.images.filter((_: any, i: number) => i !== idx) })}
                          className="p-0.5 bg-black/60 rounded text-zinc-300 hover:text-white hover:bg-black/80 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div className="flex justify-between w-full">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            const newImages = [...newProject.images];
                            [newImages[idx - 1], newImages[idx]] = [newImages[idx], newImages[idx - 1]];
                            setNewProject({ ...newProject, images: newImages });
                          }}
                          className="p-0.5 bg-black/60 rounded text-zinc-300 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === newProject.images.length - 1}
                          onClick={() => {
                            const newImages = [...newProject.images];
                            [newImages[idx + 1], newImages[idx]] = [newImages[idx], newImages[idx + 1]];
                            setNewProject({ ...newProject, images: newImages });
                          }}
                          className="p-0.5 bg-black/60 rounded text-zinc-300 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <label className="h-20 w-32 flex flex-col items-center justify-center gap-2 rounded-md bg-zinc-950 border border-zinc-800 border-dashed hover:bg-zinc-900 transition-colors cursor-pointer text-zinc-400 text-xs">
                  {uploading ? <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" /> : <Upload size={16} />}
                  {uploading ? "Uploading..." : "Add Image"}
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                </label>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-4 mt-6">
              <button
                type="button"
                onClick={() => setShowArchitecture(!showArchitecture)}
                className="w-full flex items-center justify-between py-2 text-zinc-300 hover:text-white font-medium border border-zinc-800 bg-zinc-900/50 px-3 rounded-md transition-colors"
              >
                <span>Architecture Case Study (Optional)</span>
                {showArchitecture ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showArchitecture && (
                <div className="space-y-4 mt-4 p-4 rounded-md border border-zinc-800 bg-zinc-950/40">
                  <div>
                    <label className="block text-zinc-400 mb-1">Architecture Diagram (Mermaid syntax)</label>
                    <textarea
                      value={newProject.architectureDiagram || ""}
                      onChange={(e) => setNewProject({...newProject, architectureDiagram: e.target.value})}
                      placeholder="graph TD;&#10;  A[Frontend] --> B[Backend];"
                      className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors h-24 font-mono text-xs resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Database Schema (Mermaid syntax)</label>
                    <textarea
                      value={newProject.databaseSchema || ""}
                      onChange={(e) => setNewProject({...newProject, databaseSchema: e.target.value})}
                      placeholder="erDiagram;&#10;  USER ||--o{ POST : writes"
                      className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors h-24 font-mono text-xs resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">State Management Details</label>
                    <textarea
                      value={newProject.stateManagement || ""}
                      onChange={(e) => setNewProject({...newProject, stateManagement: e.target.value})}
                      placeholder="Describe the state management approach (e.g., Zustand with global slice, local React state for modal forms)..."
                      className="w-full px-3 py-2 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors h-24 resize-y"
                    />
                  </div>

                  <div className="border-t border-zinc-800 pt-4">
                    <label className="block text-zinc-300 font-medium mb-2">Technical Challenges</label>
                    
                    {/* Challenges List Builder */}
                    {newProject.challenges && newProject.challenges.length > 0 && (
                      <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
                        {newProject.challenges.map((challenge: any, idx: number) => (
                          <div key={idx} className="p-3 rounded bg-zinc-900 border border-zinc-800 relative group">
                            <button
                              type="button"
                              onClick={() => {
                                setNewProject({
                                  ...newProject,
                                  challenges: newProject.challenges.filter((_: any, i: number) => i !== idx)
                                });
                              }}
                              className="absolute top-2 right-2 p-1 text-zinc-500 hover:text-red-400 rounded hover:bg-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove Challenge"
                            >
                              <Trash2 size={12} />
                            </button>
                            <h4 className="font-semibold text-zinc-200 pr-6 text-xs flex items-center gap-1">
                              <span className="text-zinc-500">{idx + 1}.</span> {challenge.title}
                            </h4>
                            <p className="text-[11px] text-zinc-400 mt-1"><strong className="text-zinc-500 text-[10px]">CHALLENGE:</strong> {challenge.description}</p>
                            <p className="text-[11px] text-zinc-400 mt-1"><strong className="text-zinc-500 text-[10px]">SOLUTION:</strong> {challenge.solution}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Challenge Inputs */}
                    <div className="p-3 rounded bg-zinc-900/50 border border-dashed border-zinc-800 space-y-3">
                      <p className="text-xs font-semibold text-zinc-400">Add Technical Challenge</p>
                      <div>
                        <input
                          type="text"
                          placeholder="Challenge Title (e.g. Memory Leak on Re-mount)"
                          value={challengeInput.title}
                          onChange={(e) => setChallengeInput({ ...challengeInput, title: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none text-xs transition-colors"
                        />
                      </div>
                      <div>
                        <textarea
                          placeholder="Describe the challenge..."
                          value={challengeInput.description}
                          onChange={(e) => setChallengeInput({ ...challengeInput, description: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none text-xs transition-colors h-14 resize-none"
                        />
                      </div>
                      <div>
                        <textarea
                          placeholder="Explain your solution..."
                          value={challengeInput.solution}
                          onChange={(e) => setChallengeInput({ ...challengeInput, solution: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 focus:border-zinc-600 focus:outline-none text-xs transition-colors h-14 resize-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (!challengeInput.title || !challengeInput.description || !challengeInput.solution) {
                            toast("Please fill out all challenge fields.", "error");
                            return;
                          }
                          setNewProject({
                            ...newProject,
                            challenges: [...(newProject.challenges || []), challengeInput]
                          });
                          setChallengeInput({ title: "", description: "", solution: "" });
                          toast("Challenge added to list!", "success");
                        }}
                        className="w-full py-1.5 rounded bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 hover:text-white transition-colors text-xs font-medium flex items-center justify-center gap-1"
                      >
                        <Plus size={12} /> Add to Challenges List
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
        
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-zinc-800 text-zinc-300 font-medium hover:bg-zinc-700 transition-colors text-sm border border-zinc-700">Cancel</button>
          <button type="submit" form="project-form" disabled={loading} className="px-4 py-2 rounded-md bg-zinc-100 text-zinc-900 font-medium hover:bg-zinc-200 transition-colors text-sm disabled:opacity-50 flex items-center gap-2">
            <Save size={14} /> {editingProjectId ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
