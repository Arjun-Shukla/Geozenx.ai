import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ImageAnalysis from './components/ImageAnalysis';
import TransitionMatrix from './components/TransitionMatrix';
import ChangeQueryChat from './components/ChangeQueryChat';
import { Globe, Shield, Terminal } from 'lucide-react';

export default function App() {
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalysisComplete = () => {
    setIsAnalyzed(true);
  };

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 font-sans bg-tech-grid bg-starfield flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      
      <div>
        {/* Top Header */}
        <Header />

        {/* Main Hero */}
        <Hero />

        {/* Main Workspace Container */}
        <main className="space-y-2 pb-12">
          {/* Section 1: Image Change Analysis */}
          <ImageAnalysis 
            onAnalysisComplete={handleAnalysisComplete}
            isAnalyzing={isAnalyzing}
            setIsAnalyzing={setIsAnalyzing}
          />

          {/* Section 2: Transition Matrix & Pseudo-Change Filter */}
          <TransitionMatrix 
            isAnalyzed={isAnalyzed}
          />

          {/* Section 3: Change Intelligence Natural Language Chat */}
          <ChangeQueryChat />
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-space-800/80 bg-space-950/90 py-6 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-cyan-500" />
            <span>GeoZenX.ai Remote Sensing Platform • Deep-Tech Change Intelligence</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <span>TEST PLATFORM</span>
            </span>
            <span>COORDS: 24.7136° N, 46.6753° E</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
