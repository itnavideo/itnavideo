"use client";
import React from 'react';

export default function Dashboard() {
  const videos = [
    { id: 1, title: "Viral AI Short #1", status: "Completed", date: "2026-05-08" },
    { id: 2, title: "Motivational Reel", status: "Processing", date: "2026-05-08" },
  ];

  return (
    <div className="min-h-screen bg-black p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">Your Library</h1>
          <button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-bold transition">
            + New Video
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="bg-gray-900 border border-gray-800 p-5 rounded-2xl hover:border-purple-500/50 transition">
              <div className="aspect-video bg-gray-800 rounded-lg mb-4 flex items-center justify-center text-gray-600 font-mono italic">
                {video.status === "Processing" ? "Rendering..." : "Video Preview"}
              </div>
              <h3 className="font-bold text-lg">{video.title}</h3>
              <div className="flex justify-between items-center mt-4">
                <span className={`text-xs px-2 py-1 rounded ${video.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                  {video.status}
                </span>
                <span className="text-gray-500 text-xs">{video.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}