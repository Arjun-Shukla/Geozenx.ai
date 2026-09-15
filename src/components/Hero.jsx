import React from 'react';
import { Sparkles, Layers, Cpu } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-8 pb-6 text-center max-w-4xl mx-auto px-4">
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
    </section>
  );
}
