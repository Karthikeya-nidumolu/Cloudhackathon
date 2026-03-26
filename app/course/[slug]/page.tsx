"use client";

import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import YouTube from "react-youtube";

import { updateProgress } from "@/lib/progress";

const courses: any = {
  aws: {
    title: "AWS Course 🚀",
    videoId: "3hLmDS179YE",
  },
  devops: {
    title: "DevOps Course ⚙️",
    videoId: "j5Zsa_eOXeY",
  },
  ai: {
    title: "AI Course 🤖",
    videoId: "2ePf9rue1Ao",
  },
};

export default function CoursePage() {
  const { slug } = useParams() as { slug: string };
  const course = courses[slug];

  const playerRef = useRef<any>(null);
  const [progress, setProgress] = useState(0);

  // 🔥 START TRACKING WHEN VIDEO READY
  const handleReady = (event: any) => {
    playerRef.current = event.target;

    setInterval(() => {
      const player = playerRef.current;

      if (!player) return;

      const duration = player.getDuration();
      const current = player.getCurrentTime();

      if (!duration) return;

      const percent = Math.floor((current / duration) * 100);

      setProgress(percent);
      updateProgress(slug, percent);
    }, 3000); // every 3 seconds
  };

  if (!course) {
    return <div className="text-white p-10">Course not found</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">

      <h1 className="text-3xl font-bold mb-6">
        {course.title}
      </h1>

      {/* 🎥 YOUTUBE PLAYER */}
      <YouTube
        videoId={course.videoId}
        className="w-full mb-6"
        iframeClassName="w-full h-[400px] rounded-lg"
        onReady={handleReady}
      />

      {/* 📊 PROGRESS */}
      <div className="w-full bg-gray-700 h-3 rounded">
        <div
          className="bg-cyan-400 h-3 rounded"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-2">{progress}% completed</p>

    </div>
  );
}