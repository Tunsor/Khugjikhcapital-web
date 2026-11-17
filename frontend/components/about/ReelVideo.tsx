"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Muted, looping video that plays only while it is on screen.
 * A small button toggles sound; clicking the video toggles play/pause.
 */
export default function ReelVideo({
  src,
  label,
  className = "",
}: {
  src: string;
  label: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  }

  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (!video.muted && video.paused) video.play().catch(() => {});
  }

  return (
    <div
      className={`group relative overflow-hidden bg-[#0D1216] ${className}`}
    >
      <video
        ref={videoRef}
        src={`${src}#t=0.1`}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        onClick={togglePlay}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        className="absolute inset-0 h-full w-full cursor-pointer object-cover"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0D1216]/45 via-transparent to-transparent" />

      {paused && (
        <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#003189] shadow-xl">
          <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d="M8 5.5v13l11-6.5z" />
          </svg>
        </span>
      )}

      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? "Дуу нээх" : "Дуу хаах"}
        className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-[#003189]/90 text-white backdrop-blur-sm transition-colors hover:bg-[#F4AC38] hover:text-[#0D1216] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M11 5 6 9H2v6h4l5 4z" />
          {muted ? (
            <path d="m22 9-6 6M16 9l6 6" />
          ) : (
            <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />
          )}
        </svg>
      </button>
    </div>
  );
}
