import React from 'react';
import { Satellite, Radio, ShieldCheck, Activity } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-space-700/60 bg-space-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left Side: Logo & Subtitle */}
        <div className="flex items-center space-x-3.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-space-900 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
            <Satellite className="w-5 h-5 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white font-sans bg-gradient-to-r from-white via-slate-200 to-cyan-300 bg-clip-text text-transparent">
                GeoZenX<span className="text-cyan-400 font-mono">.ai</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-medium uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded">
                v1.0
              </span>
            </div>
            <p className="text-[10px] font-mono font-semibold tracking-widest text-slate-400 uppercase">
              SPACE REMOTE SENSING • CHANGE INTELLIGENCE
            </p>
          </div>
        </div>

        {/* Right Side: Telemetry & System Status Indicator */}
        <div className="flex items-center space-x-4">
          {/* Telemetry info hidden on tiny screens */}
          <div className="hidden md:flex items-center space-x-4 text-xs font-mono text-slate-400 border-r border-space-700/80 pr-4">
            <div className="flex items-center space-x-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>ORBIT: <span className="text-slate-200">SENTINEL-2B</span></span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>LATENCY: <span className="text-slate-200">14ms</span></span>
            </div>
          </div>

          {/* SYSTEM ONLINE Badge */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium shadow-[0_0_10px_rgba(16,185,129,0.1)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="tracking-wider uppercase text-[11px] font-semibold">● SYSTEM ONLINE</span>
          </div>
        </div>

      </div>
    </header>
  );
}
