"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { MessageSquare, Send, X, Edit2, Check, User, Users } from "lucide-react";
import { auth, db, isFirebaseConfigured } from "@/lib/firebase";
import { signInAnonymously } from "firebase/auth";
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "./Toast";

const ANIMALS = ["Panda", "Cheetah", "Beaver", "Otter", "Fox", "Koala", "Falcon", "Dolphin", "Badger", "Squirrel"];
const ADJECTIVES = ["Swift", "Clever", "Jolly", "Mystic", "Zen", "Bold", "Bright", "Quiet", "Fierce", "Nifty"];

interface Message {
  id: string;
  text: string;
  senderName: string;
  senderId: string;
  timestamp: any;
}

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [nickname, setNickname] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  const [loading, setLoading] = useState(false);
  const [onlineCount, setOnlineCount] = useState(1);

  // Window Dimension State (for resizing)
  const [dimensions, setDimensions] = useState({ width: 360, height: 480 });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  // Reset positions and size on reopen
  useEffect(() => {
    if (isOpen) {
      setDimensions({ width: 360, height: 480 });
    }
  }, [isOpen]);

  // Generate anonymous nickname
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("chat_nickname");
      if (stored) {
        setNickname(stored);
        setTempName(stored);
      } else {
        const randAdj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
        const randAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
        const generated = `Anonymous ${randAdj} ${randAnimal}`;
        localStorage.setItem("chat_nickname", generated);
        setNickname(generated);
        setTempName(generated);
      }
    }
  }, []);

  // Firebase anonymous auth
  useEffect(() => {
    if (!isOpen || !isFirebaseConfigured || !auth) return;
    signInAnonymously(auth)
      .then(() => {
        console.log("Authenticated anonymously!");
      })
      .catch((err) => {
        console.error("Auth Error:", err);
      });
  }, [isOpen]);

  // Firebase real-time subscription
  useEffect(() => {
    if (!isOpen || !isFirebaseConfigured || !db) return;

    setLoading(true);
    const q = query(
      collection(db, "chat_messages"),
      orderBy("timestamp", "asc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            text: data.text || "",
            senderName: data.senderName || "Anonymous",
            senderId: data.senderId || "",
            timestamp: data.timestamp,
          };
        });
        setMessages(msgs);
        setLoading(false);
        setOnlineCount(Math.floor(Math.random() * 8) + 4);
      },
      (err) => {
        console.error("Firestore Listen Error:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isOpen]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (!isFirebaseConfigured || !db || !auth) {
      toast("Firebase config is missing in .env.local.", "error");
      return;
    }

    try {
      const msgText = inputText.trim();
      setInputText("");

      await addDoc(collection(db, "chat_messages"), {
        text: msgText,
        senderName: nickname,
        senderId: auth.currentUser?.uid || "anon",
        timestamp: serverTimestamp(),
      });
    } catch (err: any) {
      console.error("Send Error:", err);
      toast("Failed to send message.", "error");
    }
  };

  const handleSaveNickname = () => {
    if (tempName.trim()) {
      const sanitized = tempName.trim().substring(0, 24);
      setNickname(sanitized);
      localStorage.setItem("chat_nickname", sanitized);
      setIsEditingName(false);
      toast(`Nickname changed to ${sanitized}`, "success");
    }
  };

  // Custom Mouse Drag Resize Handlers
  const handleResizeWidth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = dimensions.width;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      setDimensions(prev => ({
        ...prev,
        width: Math.max(300, Math.min(550, startWidth + deltaX))
      }));
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleResizeHeight = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const startY = e.clientY;
    const startHeight = dimensions.height;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY;
      setDimensions(prev => ({
        ...prev,
        height: Math.max(380, Math.min(750, startHeight + deltaY))
      }));
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleResizeBoth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = dimensions.width;
    const startHeight = dimensions.height;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      setDimensions({
        width: Math.max(300, Math.min(550, startWidth + deltaX)),
        height: Math.max(380, Math.min(750, startHeight + deltaY)),
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none md:p-0">
        
        {/* Backdrop for mobile, clicks outside close the window */}
        <div 
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto z-10 md:hidden"
        />

        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          
          // Drag Controls
          drag
          dragControls={dragControls}
          dragListener={false} // Draggable only from the header grab
          dragMomentum={false}
          dragElastic={0}
          
          className="pointer-events-auto z-20 flex flex-col shadow-2xl border border-white/10 backdrop-blur-3xl bg-zinc-950/90
            /* Mobile Layout Styles */
            fixed bottom-0 left-0 right-0 h-[85vh] rounded-t-[32px]
            /* Desktop Layout Styles (Dropdown from topbar beside wifi) */
            md:fixed md:bottom-auto md:left-auto md:right-6 md:top-12 md:rounded-2xl"
          style={{
            // Apply dynamic dimensions on desktop only
            width: typeof window !== "undefined" && window.innerWidth >= 768 ? `${dimensions.width}px` : "100%",
            height: typeof window !== "undefined" && window.innerWidth >= 768 ? `${dimensions.height}px` : "85vh",
          }}
        >
          {/* iOS DRAG HANDLE (Mobile only) */}
          <div className="flex md:hidden w-full justify-center pt-3 pb-1">
            <div className="w-12 h-1.5 rounded-full bg-white/20" onClick={onClose} />
          </div>

          {/* WINDOW HEADER (DRAG HANDLE) */}
          <div 
            onPointerDown={(e) => dragControls.start(e)}
            className="relative flex items-center justify-between px-6 py-4 md:py-3.5 border-b border-white/10 select-none cursor-grab active:cursor-grabbing shrink-0"
          >
            {/* macOS Style Window controls (Desktop) */}
            <div className="hidden md:flex items-center gap-1.5 shrink-0">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="w-3 h-3 rounded-full bg-red-500/80 border border-red-500/50 flex items-center justify-center text-[7px] text-red-900 font-bold hover:bg-red-500 transition-colors"
              >
                ✕
              </button>
              <div className="w-3 h-3 rounded-full bg-amber-500/30 border border-amber-500/10 cursor-not-allowed"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-500/10 cursor-not-allowed"></div>
            </div>

            {/* iOS Styled Title (Centered on mobile) */}
            <div className="flex flex-col items-center md:items-start w-full md:w-auto md:ml-4">
              <span className="font-bold text-xs text-white tracking-tight flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                Global Anonymous Chat
              </span>
              <span className="text-[9px] text-zinc-400 flex items-center gap-1 mt-0.5">
                <Users className="w-2.5 h-2.5 text-emerald-400" />
                {onlineCount} active explorers
              </span>
            </div>

            {/* Close Button for mobile header */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="md:hidden absolute right-6 top-4 p-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* NICKNAME MANAGEMENT BAR */}
          <div className="bg-white/[0.02] border-b border-white/5 px-6 py-2 flex items-center justify-between text-xs text-zinc-400 shrink-0">
            <div className="flex items-center gap-2 w-full">
              <User className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              {isEditingName ? (
                <div className="flex items-center gap-1.5 w-full">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    maxLength={24}
                    placeholder="Enter nickname..."
                    className="bg-zinc-900 border border-white/10 rounded px-2 py-0.5 text-white focus:outline-none focus:border-emerald-500 text-xs w-full max-w-[150px]"
                    onKeyDown={(e) => e.key === "Enter" && handleSaveNickname()}
                    autoFocus
                  />
                  <button onClick={handleSaveNickname} className="p-1 hover:bg-white/10 rounded text-emerald-400">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 w-full justify-between">
                  <span className="text-zinc-300 font-medium truncate max-w-[180px]">
                    Chatting as: <strong className="text-emerald-400 font-semibold">{nickname}</strong>
                  </span>
                  <button 
                    onClick={() => {
                      setTempName(nickname);
                      setIsEditingName(true);
                    }} 
                    className="flex items-center gap-1 hover:text-white transition-colors py-0.5 px-2 rounded hover:bg-white/5 border border-transparent hover:border-white/10"
                  >
                    <Edit2 className="w-3 h-3" />
                    Rename
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* MESSAGES CONSOLE */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin select-text">
            {loading ? (
              <div className="h-full flex items-center justify-center flex-col gap-2">
                <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-zinc-500">Connecting to global lobby...</span>
              </div>
            ) : !isFirebaseConfigured ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-400 mb-4 border border-emerald-500/20">
                  <MessageSquare className="w-8 h-8 animate-pulse" />
                </div>
                <h4 className="font-semibold text-white text-sm mb-1">Firebase Configuration Required</h4>
                <p className="text-xs text-zinc-400 max-w-[240px] leading-relaxed">
                  To open live chat, fill out the empty Firebase variables in your <code className="text-emerald-300 font-mono">.env.local</code>.
                </p>
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 text-xs text-center py-10">
                <p>Welcome to the lobby! 👋</p>
                <p className="mt-1">Be the first to say something.</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === auth?.currentUser?.uid;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="text-[9px] text-zinc-500 font-medium">
                        {isMe ? "You" : msg.senderName}
                      </span>
                    </div>
                    <div 
                      className={`max-w-[80%] px-4 py-2 rounded-2xl text-xs shadow-md leading-relaxed whitespace-pre-wrap break-words
                        ${isMe 
                          ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-tr-none" 
                          : "bg-white/5 border border-white/10 text-zinc-100 rounded-tl-none"
                        }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT FORM BAR */}
          <form 
            onSubmit={handleSendMessage} 
            className="p-4 border-t border-white/10 bg-zinc-950/80 flex items-center gap-2 rounded-b-2xl shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isFirebaseConfigured ? "Type a message..." : "Configure Firebase..."}
              disabled={!isFirebaseConfigured}
              className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!inputText.trim() || !isFirebaseConfigured}
              className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:bg-emerald-500 flex items-center justify-center shrink-0 w-8 h-8"
              data-cursor="button"
            >
              <Send className="w-3.5 h-3.5" />
            </motion.button>
          </form>

          {/* DESKTOP RESIZE HANDLES */}
          {/* Right Border Resize Handle */}
          <div 
            onMouseDown={handleResizeWidth}
            className="hidden md:block absolute top-0 right-0 w-1 h-full cursor-e-resize z-30 hover:bg-emerald-500/20 transition-colors"
            title="Drag to Resize Width"
          />

          {/* Bottom Border Resize Handle */}
          <div 
            onMouseDown={handleResizeHeight}
            className="hidden md:block absolute bottom-0 left-0 w-full h-1 cursor-s-resize z-30 hover:bg-emerald-500/20 transition-colors"
            title="Drag to Resize Height"
          />

          {/* Bottom-Right Corner Resize Handle */}
          <div 
            onMouseDown={handleResizeBoth}
            className="hidden md:block absolute bottom-0.5 right-0.5 w-4 h-4 cursor-se-resize z-40"
            title="Drag to Resize Width & Height"
          >
            <svg className="w-full h-full text-zinc-600 hover:text-emerald-400 transition-colors opacity-70" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22 22h-2v-2h2v2zm0-4h-2v-2h2v2zm-4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm-4 4h-2v-2h2v2z"/>
            </svg>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
