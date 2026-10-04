import React, { useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function Hero() {
  const videos = [useRef(null), useRef(null)];
  const [activeVideo, setActiveVideo] = useState(0);
  const [isCrossfading, setIsCrossfading] = useState(false);
  const crossfadeStarted = useRef(false);
  const crossfadeDuration = 1.5;

  const startCrossfade = (event) => {
    const video = event.currentTarget;
    const nextVideo = videos[1 - activeVideo].current;

    if (
      video !== videos[activeVideo].current ||
      crossfadeStarted.current ||
      !Number.isFinite(video.duration) ||
      video.duration - video.currentTime > crossfadeDuration
    ) {
      return;
    }

    crossfadeStarted.current = true;
    nextVideo.currentTime = 0;
    setIsCrossfading(true);
    nextVideo.play().catch((error) => {
      console.error('Could not start the hero background video crossfade.', error);
    });
  };

  const finishLoop = (event) => {
    const video = event.currentTarget;
    if (video !== videos[activeVideo].current) return;

    video.pause();
    video.currentTime = 0;
    setActiveVideo(1 - activeVideo);
    setIsCrossfading(false);
    crossfadeStarted.current = false;
  };

  return (
    <section className="relative isolate overflow-hidden pt-8 pb-6 text-center">
      {[0, 1].map((index) => (
        <video
          key={index}
          ref={videos[index]}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ${
            index === activeVideo
              ? isCrossfading
                ? 'opacity-0'
                : 'opacity-100'
              : isCrossfading
                ? 'opacity-100'
                : 'opacity-0'
          }`}
          autoPlay={index === 0}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          onTimeUpdate={index === activeVideo ? startCrossfade : undefined}
          onEnded={index === activeVideo ? finishLoop : undefined}
        >
          <source src="/hero-background.mp4" type="video/mp4" />
        </video>
      ))}
      <div className="absolute inset-0 bg-space-950/75" />

      <div className="relative z-10 mx-auto max-w-4xl px-4">
        {/* Small Eyebrow Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-space-850 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-4">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>NEXT-GEN SPECTRAL DIFFERENCING ENGINE</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
          Satellite Change Detection
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl font-medium font-mono text-cyan-400 tracking-wide mb-4">
          Compare. Detect. Understand.
        </p>

        {/* Supporting Description */}
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-sans leading-relaxed">
          GeoZenX.ai ingests multi-temporal satellite imagery, aligns spatial coordinates,
          and executes deep spectral band comparison to automatically identify, quantify,
          and classify surface land cover changes over time.
        </p>
      </div>
    </section>
  );
}
