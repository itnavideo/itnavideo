"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Film, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthContext";
import VideoCard from "@/components/dashboard/VideoCard";

const filters = ["All", "Completed", "Processing", "Error"];

export default function VideosPage() {
  const { user, loading: authLoading } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setJobs([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const syncProjects = async () => {
      try {
        const jobsData = await fetchUserProjects(user.uid);
        if (cancelled) return;
        setJobs(jobsData);
        setLoading(false);
      } catch (error) {
        if (cancelled) return;
        console.error("Video library sync failed:", error);
        setLoading(false);
      }
    };

    void syncProjects();
    const interval = window.setInterval(syncProjects, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [authLoading, user]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const status = normalizeStatus(job.status);
      if (filter === "All") return true;
      return status === filter;
    });
  }, [filter, jobs]);

  const handleDeleteVideo = async (job) => {
    if (!user || !job?.id) return;

    const confirmed = window.confirm(`Delete "${job.title || "Untitled Project"}" from your video library?`);
    if (!confirmed) return;

    try {
      await deleteProject(user.uid, job.id);
      setJobs((items) => items.filter((item) => item.id !== job.id));
      removeLocalDashboardJob(user.uid, job.id);
      toast.success("Video removed from your library.");
    } catch (error) {
      console.error("Video delete failed:", error);
      toast.error("Could not delete this video. Please retry.");
    }
  };

  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-3 text-5xl font-bold tracking-normal">My Videos</h1>
            <p className="text-lg text-zinc-400">Manage and preview your AI-generated projects.</p>
          </div>

          <Link
            href="/upload"
            className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-purple-600 px-6 py-3 font-semibold transition hover:bg-purple-500 md:mt-0"
          >
            <Plus size={20} />
            Create New Video
          </Link>
        </div>

        <div className="mb-10 flex flex-wrap gap-3">
          {filters.map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`rounded-xl border px-5 py-2 font-medium transition ${
                filter === item
                  ? "border-purple-500 bg-purple-600 text-white"
                  : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-600"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <Loader2 className="mb-4 animate-spin" size={32} />
            <p>Loading your library...</p>
          </div>
        ) : !user ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-zinc-900/20 py-24 text-center">
            <Film className="mx-auto mb-4 text-zinc-700" size={48} />
            <p className="text-zinc-500">Sign in to see your video library.</p>
            <Link href="/login" className="mt-5 inline-flex rounded-lg bg-white px-5 py-3 font-bold text-black transition hover:bg-zinc-200">
              Sign in
            </Link>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <VideoCard
                key={job.id}
                title={job.title || "Untitled Project"}
                videoUrl={job.videoUrl || job.renderUrl}
                status={job.status}
                createdAt={formatCreatedAt(job.createdAt)}
                onDelete={() => handleDeleteVideo(job)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/10 bg-zinc-900/20 py-24 text-center">
            <Film className="mx-auto mb-4 text-zinc-700" size={48} />
            <p className="text-zinc-500">No projects found in this category.</p>
          </div>
        )}
      </div>
    </main>
  );
}

async function deleteProject(userId, projectId) {
  const response = await fetch("/api/projects/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, projectId }),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    throw new Error(data.details || data.error || "Delete failed.");
  }
}

async function fetchUserProjects(userId) {
  const response = await fetch(`/api/projects/list?userId=${encodeURIComponent(userId)}`, { cache: "no-store" });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.details || data.error || "Project list failed.");
  }

  return Array.isArray(data.projects) ? data.projects : [];
}

function removeLocalDashboardJob(userId, jobId) {
  try {
    const storageKey = `itnavideo.projects.${userId}`;
    const existing = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
    if (!Array.isArray(existing)) return;
    window.localStorage.setItem(storageKey, JSON.stringify(existing.filter((item) => item?.id !== jobId)));
  } catch (error) {
    console.warn("Local video cache delete failed:", error);
  }
}

function normalizeStatus(status) {
  const value = String(status || "").toLowerCase();
  if (value.includes("ready") || value.includes("completed")) return "Completed";
  if (value.includes("error") || value.includes("retry")) return "Error";
  return "Processing";
}

function formatCreatedAt(value) {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  return undefined;
}
