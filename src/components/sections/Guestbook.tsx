"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { Send, User } from "lucide-react";
import { toast } from "../ui/Toast";

interface GuestMessage {
  id: string;
  name: string;
  message: string;
  timestamp: unknown;
}

export default function Guestbook() {
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [inputName, setInputName] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!db) return;
    
    const q = query(
      collection(db, "guestbook"),
      orderBy("timestamp", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GuestMessage[];
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim() || !inputMessage.trim()) return;
    if (!db) {
      toast("Firebase is not configured.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "guestbook"), {
        name: inputName.trim(),
        message: inputMessage.trim(),
        timestamp: serverTimestamp()
      });
      setInputMessage("");
      toast("Message signed! Thanks for visiting.", "success");
    } catch {
      toast("Failed to post message.", "error");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-20 px-6">
      <div className="mb-8 border-b border-white/10 pb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Guestbook</h2>
        <p className="text-zinc-400">Leave a trace. Sign the guestbook below.</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-10 flex flex-col gap-4 bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
        <input 
          type="text" 
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          placeholder="Your Name (e.g. John Doe)" 
          className="bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
          maxLength={30}
          required
        />
        <textarea 
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Leave a short message..." 
          className="bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none h-24"
          maxLength={150}
          required
        />
        <button 
          type="submit" 
          disabled={isSubmitting || !db}
          className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          {isSubmitting ? "Signing..." : "Sign Guestbook"} <Send className="w-4 h-4" />
        </button>
      </form>

      <div className="space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className="bg-white/5 p-4 rounded-xl border border-white/5">
            <p className="text-zinc-300 text-sm mb-3">{msg.message}</p>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <User className="w-3 h-3" />
              <span className="font-medium text-zinc-400">{msg.name}</span>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-center py-10 text-zinc-600 italic">No messages yet. Be the first!</div>
        )}
      </div>
    </div>
  );
}
