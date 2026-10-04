import React, { useEffect, useState } from 'react';
import { Table, TrendingUp, TrendingDown, ShieldAlert, CheckCircle2, Sliders, Info, Eye, Layers } from 'lucide-react';
import { MOCK_TRANSITION_MATRIX, MOCK_CHANGE_SUMMARY, SAMPLE_PRESETS } from '../data/mockData';
import { checkImageQuality } from '../api';

export default function TransitionMatrix({ isAnalyzed, analysisData, analysisImages }) {
  const [isFiltering, setIsFiltering] = useState(false);
  const [filterResult, setFilterResult] = useState(null);
  const [filterError, setFilterError] = useState('');
  const [showMaskPreview, setShowMaskPreview] = useState(false);
  const transitionMatrix = analysisData?.transitionMatrix?.length
    ? analysisData.transitionMatrix
    : MOCK_TRANSITION_MATRIX;
  const changeSummary = analysisData?.summary
    ? { ...MOCK_CHANGE_SUMMARY, ...analysisData.summary }
    : MOCK_CHANGE_SUMMARY;

  useEffect(() => {
    setFilterResult(null);
    setFilterError('');
  }, [analysisData]);

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

  const handleRunFilter = async () => {
    if (isFiltering || !analysisImages) return;
    setIsFiltering(true);
    setFilterError('');
    try {
      const result = await checkImageQuality(analysisImages);
      setFilterResult(result);
    } catch (error) {
      setFilterError(error.message);
    } finally {
      setIsFiltering(false);
    }
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
              {changeSummary.confidenceScore}%
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
            {filterResult ? (
              <div className={`px-4 py-2 rounded-lg border font-mono text-xs font-semibold flex items-center space-x-2 ${
                filterResult.falseDetectionRisk === 'high'
                  ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                  : filterResult.falseDetectionRisk === 'medium'
                    ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                    : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              }`}>
                <CheckCircle2 className={`w-4 h-4 ${
                  filterResult.falseDetectionRisk === 'high'
                    ? 'text-rose-400'
                    : filterResult.falseDetectionRisk === 'medium'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                }`} />
                <span>QUALITY CHECK COMPLETE · {filterResult.falseDetectionRisk?.toUpperCase()} RISK</span>
              </div>
            ) : (
              <button
                onClick={handleRunFilter}
                disabled={isFiltering || !analysisImages}
                className={`px-6 py-2.5 rounded-lg font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2 ${
                  isFiltering || !analysisImages
                    ? 'bg-space-800 text-slate-500 cursor-not-allowed border border-space-700'
                    : 'bg-space-800 hover:bg-space-750 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white shadow-md active:scale-[0.99]'
                }`}
              >
                <span>{isFiltering ? 'RUNNING IMAGE QUALITY CHECK...' : '◈ PSEUDO-CHANGE FILTER'}</span>
              </button>
            )}
          </div>
        </div>

        {filterError && (
          <div role="alert" className="mt-4 p-3 rounded-lg bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs font-mono">
            Image quality check failed: {filterError}
          </div>
        )}

        {filterResult && (
          <div className="mt-4 p-4 rounded-lg bg-space-950 border border-cyan-500/30 space-y-3">
            <p className="text-sm text-slate-200">{filterResult.message}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-slate-400">
              <span>VALID FOR CHANGE DETECTION: <strong className={filterResult.validForChangeDetection ? 'text-emerald-300' : 'text-rose-300'}>{filterResult.validForChangeDetection ? 'YES' : 'NO'}</strong></span>
              <span>ASSESSMENT CONFIDENCE: <strong className="text-cyan-300">{filterResult.confidence}%</strong></span>
            </div>
            {filterResult.issues?.filter((issue) => issue.detected).length > 0 && (
              <ul className="space-y-1 text-xs text-slate-300">
                {filterResult.issues.filter((issue) => issue.detected).map((issue, index) => (
                  <li key={`${issue.type}-${index}`}>
                    <span className="text-amber-300">{issue.type.replaceAll('_', ' ').toUpperCase()} · {issue.severity.toUpperCase()}:</span> {issue.explanation}
                  </li>
                ))}
              </ul>
            )}
            <p className="text-xs text-slate-400">RECOMMENDATION: {filterResult.recommendation}</p>
          </div>
        )}

        {isFiltering && (
          <div role="status" className="mt-4 p-4 rounded-lg bg-space-950 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Checking temporal images for pseudo-change risks...</span>
            </div>
        )}
      </div>

    </section>
  );
}
