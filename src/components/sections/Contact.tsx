"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "../ui/BrandIcons";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "../ui/Toast";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast("Please fill in all fields.", "error");
      return;
    }

    try {
      setLoading(true);
      
      // 1. Send Email via Nodemailer API
      const emailRes = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() })
      });
      
      const emailData = await emailRes.json();
      
      if (!emailRes.ok) {
        throw new Error(emailData.error || "Failed to send email");
      }

      // 2. Log to Firebase (if configured)
      if (isFirebaseConfigured && db) {
        try {
          await addDoc(collection(db, "contact_messages"), {
            name: name.trim(),
            email: email.trim(),
            message: message.trim(),
            timestamp: serverTimestamp(),
          });
        } catch (firebaseErr) {
          console.error("Firebase Logging Error:", firebaseErr);
          // We don't throw here because the email was already sent successfully
        }
      }

      toast("Message sent successfully!", "success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: unknown) {
      console.error("Contact Form Error:", err);
      toast(err instanceof Error ? err.message : "Failed to send message.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-6 max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-6xl font-black mb-5 tracking-tighter leading-none">Get In Touch</h2>
        <p className="text-zinc-300 text-lg max-w-2xl mx-auto leading-relaxed text-balance">
          I&apos;m currently open to new opportunities and collaborations. 
          Whether you have a project in mind or just want to say hi, feel free to reach out!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <h3 className="text-3xl font-black mb-6 tracking-tighter leading-none">Contact Information</h3>
          
          <a 
            href="mailto:dasanuvab38@gmail.com"
            className="flex items-center gap-4 p-4 rounded-xl glass-effect hover:border-zinc-700 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:-translate-y-1 transition-all group duration-300"
          >
            <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
              <Mail size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-lg font-medium select-all">dasanuvab38@gmail.com</p>
            </div>
          </a>

          <a 
            href="https://www.linkedin.com/in/anv-dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-xl glass-effect hover:border-zinc-700 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:-translate-y-1 transition-all group duration-300"
          >
            <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
              <LinkedInIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400">LinkedIn</p>
              <p className="text-lg font-medium">linkedin.com/in/anv-dev</p>
            </div>
          </a>

          <a 
            href="https://github.com/Stewy8506"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-xl glass-effect hover:border-zinc-700 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:-translate-y-1 transition-all group duration-300"
          >
            <div className="p-3 rounded-xl bg-gray-500/20 text-gray-400 group-hover:scale-110 transition-transform">
              <GitHubIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400">GitHub</p>
              <p className="text-lg font-medium">github.com/Stewy8506</p>
            </div>
          </a>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4 glass-effect pt-10 pb-8 px-6 md:px-8 rounded-2xl relative transition-all duration-500 hover:border-zinc-700 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)]"
          onSubmit={handleSubmit}
        >
          {/* macOS Window Controls */}
          <div className="absolute top-4 left-5 flex items-center gap-1.5 z-20">
            <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-500/50"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-mono text-xs font-medium text-zinc-500 ml-1 uppercase tracking-widest">Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="John Doe"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label className="font-mono text-xs font-medium text-zinc-500 ml-1 uppercase tracking-widest">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="john@example.com"
                disabled={loading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-mono text-xs font-medium text-zinc-500 ml-1 uppercase tracking-widest">Message</label>
            <textarea 
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Your message here..."
              disabled={loading}
            />
          </div>
          <motion.button 
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            data-cursor="button"
          >
            {loading ? "Sending..." : "Send Message"}
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;
