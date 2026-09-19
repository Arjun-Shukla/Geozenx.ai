import React, { useState } from 'react';
import { Table, TrendingUp, TrendingDown, ShieldAlert, CheckCircle2, Sliders, Info, Eye, Layers } from 'lucide-react';
import { MOCK_TRANSITION_MATRIX, MOCK_CHANGE_SUMMARY, FILTER_STEPS, SAMPLE_PRESETS } from '../data/mockData';

export default function TransitionMatrix({ isAnalyzed, analysisData }) {
  const [isFiltering, setIsFiltering] = useState(false);
  const [filterComplete, setFilterComplete] = useState(false);
  const [filterProgress, setFilterProgress] = useState(0);
  const [filterStepIndex, setFilterStepIndex] = useState(0);
  const [showMaskPreview, setShowMaskPreview] = useState(false);
  const transitionMatrix = analysisData?.transitionMatrix?.length
    ? analysisData.transitionMatrix
    : MOCK_TRANSITION_MATRIX;
  const changeSummary = analysisData?.summary
    ? { ...MOCK_CHANGE_SUMMARY, ...analysisData.summary }
    : MOCK_CHANGE_SUMMARY;

  if (!isAnalyzed) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-4">
        <div className="bg-space-900/60 rounded-xl border border-space-800 p-8 text-center text-slate-500 font-mono text-sm hud-box">
          <Table className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-60" />
          <p>TRANSITION MATRIX AWAITING SATELLITE IMAGE ANALYSIS</p>
          <p className="text-xs text-slate-600 mt-1">Upload T1 and T2 images and click "ANALYZE CHANGES" to generate land cover transition metrics.</p>
        </div>
      </section>
    );
  }

  const handleRunFilter = () => {
    if (isFiltering || filterComplete) return;
    setIsFiltering(true);
    setFilterProgress(0);
    setFilterStepIndex(0);

    const totalSteps = FILTER_STEPS.length;
    const duration = 3000; // 3 seconds
    const intervalTime = 50;
    const increment = 100 / (duration / intervalTime);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 100) {
        currentProgress = 100;
        setFilterProgress(100);
        setFilterStepIndex(totalSteps - 1);
        clearInterval(interval);
        setTimeout(() => {
          setIsFiltering(false);
          setFilterComplete(true);
        }, 400);
      } else {
        setFilterProgress(Math.round(currentProgress));
        const stepIdx = Math.min(
          Math.floor((currentProgress / 100) * totalSteps),
          totalSteps - 1
        );
        setFilterStepIndex(stepIdx);
      }
    }, intervalTime);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      
      {/* Main Results Card */}
      <div className="bg-space-900/90 rounded-xl border border-space-700/80 p-6 shadow-2xl hud-box relative overflow-hidden">
        
        {/* Card Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-space-800 pb-4 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <Table className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-bold tracking-tight text-white uppercase font-sans">
                TRANSITION MATRIX
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-1">
              LAND COVER CLASSIFICATION DELTAS & SPECTRAL DIFFERENCING
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowMaskPreview(!showMaskPreview)}
              className="px-3 py-1.5 rounded text-xs font-mono bg-space-850 border border-space-700 hover:border-cyan-500/40 text-cyan-300 flex items-center space-x-1.5 transition"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showMaskPreview ? 'Hide Spectral Mask' : 'View Change Mask'}</span>
            </button>
            <span className="px-2.5 py-1 text-xs font-mono bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 rounded">
              ANALYSIS COMPLETE
            </span>
          </div>
        </div>

        {/* Change Mask Toggle View */}
        {showMaskPreview && (
          <div className="mb-6 p-4 rounded-lg bg-space-950 border border-cyan-500/30 text-center animate-fadeIn">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-cyan-400">HIGH-CONTRAST DIFFERENCE MASK</span>
              <span className="text-[11px] font-mono text-slate-400">CYAN = URBAN BUILDINGS (+65%) | RED = VEGETATION (-12%)</span>
            </div>
            <img 
              src={analysisData?.maskSrc || SAMPLE_PRESETS[0].maskSrc} 
              alt="Spectral Change Difference Mask" 
              className="w-full h-64 object-cover rounded border border-space-700"
            />
          </div>
        )}

        {/* Transition Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {transitionMatrix.map((item) => {
            const isPositive = item.changePercent > 0;
            return (
              <div 
                key={item.category}
                className="p-4 rounded-lg bg-space-950/80 border border-space-750 hover:border-space-600 transition group relative"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">
                    {item.category}
                  </span>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                </div>

                {/* Transition Numbers: T1 -> T2 */}
                <div className="flex items-baseline space-x-2 my-2 font-mono">
                  <span className="text-2xl font-extrabold text-white">
                    {item.t1Percent}%
                  </span>
                  <span className="text-slate-500 text-sm">→</span>
                  <span className="text-2xl font-extrabold text-white">
                    {item.t2Percent}%
                  </span>
                </div>

                {/* Change Badge */}
                <div className="flex items-center justify-between pt-2 border-t border-space-800">
                  <span className="text-[11px] font-mono text-slate-400">Change:</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold flex items-center space-x-1 ${
                    isPositive 
                      ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30' 
                      : 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                  }`}>
                    {isPositive ? (
                      <TrendingUp className="w-3 h-3 text-cyan-400" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-rose-400" />
                    )}
                    <span>{isPositive ? `+${item.changePercent}%` : `${item.changePercent}%`}</span>
                  </span>
                </div>

                {/* Description */}
                <p className="text-[11px] text-slate-400 mt-2 font-sans line-clamp-2">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Compact Change Summary Box */}
        <div className="p-4 rounded-lg bg-space-850 border border-space-750 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <div className="text-white font-semibold uppercase tracking-wider">CHANGE SUMMARY</div>
              <div className="text-slate-400 text-[11px] mt-0.5">
                PRIMARY VECTOR: <span className="text-cyan-300 font-mono font-medium">{changeSummary.primaryVector}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-right font-mono">
            <div>
              <div className="text-slate-400 text-[10px]">ANALYZED AREA</div>
              <div className="text-white font-bold">{changeSummary.totalAnalyzedAreaKm2} km²</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">NET CLASS SHIFT</div>
              <div className="text-cyan-400 font-bold">+{changeSummary.netClassShiftPercent}%</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">CONFIDENCE SCORE</div>
              <div className="text-emerald-400 font-bold">
                {filterComplete ? `${changeSummary.filteredConfidenceScore}%` : `${changeSummary.confidenceScore}%`}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* PSEUDO-CHANGE FILTER SECTION */}
      <div className="bg-space-900/90 rounded-xl border border-space-700/80 p-6 shadow-xl hud-box">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white font-sans uppercase">
                PSEUDO-CHANGE FILTERING
              </h3>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              REMOVE ILLUMINATION SHIFT, ATMOSPHERIC NOISE & SENSOR REGISTRATION ARTIFACTS
            </p>
          </div>

          <div>
            {filterComplete ? (
              <div className="px-4 py-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Pseudo-change filtering complete.</span>
              </div>
            ) : (
              <button
                onClick={handleRunFilter}
                disabled={isFiltering}
                className={`px-6 py-2.5 rounded-lg font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2 ${
                  isFiltering
                    ? 'bg-space-800 text-slate-500 cursor-not-allowed border border-space-700'
                    : 'bg-space-800 hover:bg-space-750 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white shadow-md active:scale-[0.99]'
                }`}
              >
                <span>◈ PSEUDO-CHANGE FILTER</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Progress Animation Display */}
        {isFiltering && (
          <div className="mt-4 p-4 rounded-lg bg-space-950 border border-cyan-500/30">
            <div className="flex justify-between items-center mb-2 font-mono text-xs">
              <span className="text-cyan-400 flex items-center space-x-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span>STATUS: PSEUDO-CHANGE FILTERING... [{FILTER_STEPS[filterStepIndex]}]</span>
              </span>
              <span className="text-cyan-300 font-bold">{filterProgress}%</span>
            </div>

            <div className="w-full bg-space-800 h-2 rounded-full overflow-hidden p-0.5 border border-space-700">
              <div 
                className="bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-75 ease-out shadow-[0_0_10px_rgba(0,240,255,0.8)]"
                style={{ width: `${filterProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

    </section>
  );
}
