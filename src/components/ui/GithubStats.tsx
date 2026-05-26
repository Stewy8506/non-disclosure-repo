"use client";

import React, { useEffect, useState } from "react";
import { GitCommit, Star } from "lucide-react";
import { GitHubIcon } from "@/components/ui/BrandIcons";

interface GithubData {
  public_repos: number;
  followers: number;
  stargazers_count: number;
}

export default function GithubStats() {
  const [data, setData] = useState<GithubData | null>(null);

  useEffect(() => {
    // Fetch stats for the user (assuming Stewy8506 based on repo)
    fetch("https://api.github.com/users/Stewy8506")
      .then(res => res.json())
      .then(user => {
        setData({
          public_repos: user.public_repos || 0,
          followers: user.followers || 0,
          stargazers_count: 0 // Would require traversing repos, keeping simple
        });
      })
      .catch(() => {});
  }, []);

  if (!data) return null;

  return (
    <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
      <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <GitHubIcon className="w-5 h-5 text-emerald-400" />
        </div>
        <h2 className="text-xl font-semibold text-white">Live GitHub Stats</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center justify-center">
          <GitCommit className="w-6 h-6 text-zinc-400 mb-2" />
          <span className="text-2xl font-bold text-white">{data.public_repos}</span>
          <span className="text-xs text-zinc-500 uppercase tracking-wider">Repositories</span>
        </div>
        <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center justify-center">
          <Star className="w-6 h-6 text-zinc-400 mb-2" />
          <span className="text-2xl font-bold text-white">{data.followers}</span>
          <span className="text-xs text-zinc-500 uppercase tracking-wider">Followers</span>
        </div>
      </div>
      <a href="https://github.com/Stewy8506" target="_blank" rel="noreferrer" className="mt-4 block w-full text-center py-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-500/10 rounded-lg">
        View Profile →
      </a>
    </div>
  );
}
