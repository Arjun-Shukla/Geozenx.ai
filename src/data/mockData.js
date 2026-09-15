// Pre-configured remote sensing sample satellite imagery SVG Data URLs

export const SAMPLE_PRESETS = [
  {
    id: 'urban-growth',
    name: 'Sector 07-A: Urban Infrastructure Expansion',
    location: 'Riyadh Basin Zone 4 (Sentinel-2 L2A)',
    t1Date: '2021-04-12',
    t2Date: '2024-08-29',
    resolution: '0.5m GSD',
    t1Src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23ab9b7c"/><path d="M0,0 Q180,120 350,80 T600,160 L600,0 Z" fill="%235a7a49" opacity="0.8"/><circle cx="120" cy="80" r="45" fill="%234b6b3a"/><circle cx="280" cy="50" r="35" fill="%234b6b3a"/><path d="M100,240 Q250,300 450,220 T600,340 L600,400 L0,400 L0,220 Z" fill="%239b8b6c"/><path d="M480,80 Q520,150 580,180" stroke="%233a6b8c" stroke-width="18" fill="none" opacity="0.7"/><rect x="80" y="280" width="30" height="20" fill="%23756d61" rx="2"/><rect x="120" y="290" width="25" height="25" fill="%23756d61" rx="2"/><line x1="0" y1="0" x2="600" y2="400" stroke="%23ffffff" stroke-width="0.3" opacity="0.2"/><line x1="600" y1="0" x2="0" y2="400" stroke="%23ffffff" stroke-width="0.3" opacity="0.2"/><text x="20" y="30" fill="%23ffffff" font-family="monospace" font-size="12" opacity="0.8">T1 (2021-04-12) | BAND 8/4/3</text></svg>`,
    t2Src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23706b61"/><path d="M0,0 Q180,120 350,80 T600,160 L600,0 Z" fill="%235a7a49" opacity="0.25"/><circle cx="120" cy="80" r="20" fill="%234b6b3a"/><path d="M50,150 L550,150 M180,50 L180,380 M380,50 L380,380 M50,280 L550,280" stroke="%23384252" stroke-width="6"/><g fill="%2394a3b8"><rect x="70" y="70" width="40" height="40" rx="3"/><rect x="120" y="70" width="35" height="50" rx="3"/><rect x="200" y="70" width="60" height="45" rx="3"/><rect x="270" y="70" width="80" height="60" rx="3"/><rect x="70" y="170" width="90" height="70" rx="3"/><rect x="190" y="170" width="160" height="90" rx="3"/><rect x="400" y="70" width="140" height="180" rx="3"/><rect x="70" y="300" width="280" height="70" rx="3"/><rect x="380" y="300" width="160" height="70" rx="3"/></g><path d="M480,80 Q520,150 580,180" stroke="%232b5570" stroke-width="14" fill="none" opacity="0.7"/><text x="20" y="30" fill="%2300f0ff" font-family="monospace" font-size="12" opacity="0.9">T2 (2024-08-29) | URBAN EXPANSION</text></svg>`,
    maskSrc: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23050811"/><g fill="%2300f0ff" opacity="0.85"><rect x="70" y="70" width="40" height="40" rx="3"/><rect x="120" y="70" width="35" height="50" rx="3"/><rect x="200" y="70" width="60" height="45" rx="3"/><rect x="270" y="70" width="80" height="60" rx="3"/><rect x="70" y="170" width="90" height="70" rx="3"/><rect x="190" y="170" width="160" height="90" rx="3"/><rect x="400" y="70" width="140" height="180" rx="3"/><rect x="70" y="300" width="280" height="70" rx="3"/><rect x="380" y="300" width="160" height="70" rx="3"/></g><g fill="%23ef4444" opacity="0.75"><path d="M0,0 Q180,120 350,80 T600,160 L600,0 Z"/></g><text x="20" y="30" fill="%2300f0ff" font-family="monospace" font-size="12">SPECTRAL CHANGE MASK [BUILDINGS INCREASED / VEG REDUCED]</text></svg>`
  }
];

export const MOCK_TRANSITION_MATRIX = [
  {
    category: 'VEGETATION',
    t1Percent: 14,
    t2Percent: 2,
    changePercent: -12,
    color: '#10b981', // emerald
    description: 'Dense canopy & cropland converted to urban grid structures',
    filteredNoiseDelta: -0.4
  },
  {
    category: 'BUILDINGS',
    t1Percent: 2,
    t2Percent: 67,
    changePercent: 65,
    color: '#00f0ff', // cyan
    description: 'High-density residential and commercial infrastructure built',
    filteredNoiseDelta: -1.2
  },
  {
    category: 'WATER',
    t1Percent: 8,
    t2Percent: 6,
    changePercent: -2,
    color: '#3b82f6', // blue
    description: 'Retention basin seasonal shrinkage',
    filteredNoiseDelta: -0.8
  },
  {
    category: 'BARE LAND',
    t1Percent: 76,
    t2Percent: 25,
    changePercent: -51,
    color: '#f59e0b', // amber
    description: 'Undeveloped desert soil cleared for construction',
    filteredNoiseDelta: +2.4
  }
];

export const MOCK_CHANGE_SUMMARY = {
  totalAnalyzedAreaKm2: 42.8,
  primaryVector: 'Bare Land & Vegetation → High-Density Buildings',
  netClassShiftPercent: 65.0,
  spatialResolution: '0.5m Multi-Spectral (Sentinel-2 / WorldView-3)',
  confidenceScore: 98.4,
  filteredConfidenceScore: 99.7,
  timestamp: '2026-09-16 02:56:00 UTC'
};

export const ANALYSIS_STEPS = [
  "Loading imagery...",
  "Aligning temporal datasets...",
  "Extracting spatial features...",
  "Comparing spectral signatures...",
  "Analyzing changes...",
  "Generating transition matrix..."
];

export const FILTER_STEPS = [
  "Detecting illumination artifacts...",
  "Analyzing registration noise...",
  "Filtering atmospheric variations...",
  "Removing pseudo changes...",
  "Filtering complete."
];

// Helper to generate natural language chat response based on input query
export const getMockChatResponse = (userQuery) => {
  const query = userQuery.toLowerCase().trim();

  if (query.includes('what changed the most') || query.includes('largest change') || query.includes('biggest change') || query.includes('most change')) {
    return {
      sender: 'assistant',
      text: 'Buildings show the largest increase, rising from 2% in T1 to 67% in T2 within the analyzed region (a net increase of +65 percentage points). Bare Land experienced the largest decrease, dropping from 76% down to 25% (-51 percentage points).',
      badge: 'BUILDINGS +65%',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  if (query.includes('vegetation') || query.includes('green') || query.includes('plants') || query.includes('forest')) {
    return {
      sender: 'assistant',
      text: 'Vegetation decreased from 14% in T1 to 2% in T2, indicating a 12 percentage-point reduction within the analyzed region. Spectral band ratio analysis confirms this loss was primarily driven by land clearance for new road networks and building footprints.',
      badge: 'VEGETATION -12%',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  if (query.includes('urban') || query.includes('building') || query.includes('construction') || query.includes('expansion')) {
    return {
      sender: 'assistant',
      text: 'Urban expansion was significant. Building coverage expanded rapidly from 2% in T1 to 67% in T2 (+65%). Approximately 27.8 km² of previously undeveloped bare land and vegetation was urbanized over the 3-year observation period.',
      badge: 'URBAN EXPANSION +65%',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  if (query.includes('summarize') || query.includes('summary') || query.includes('overview') || query.includes('report')) {
    return {
      sender: 'assistant',
      text: 'Analysis Summary: Over the analyzed 42.8 km² sector between T1 (2021) and T2 (2024), major land cover conversion occurred. Buildings increased +65% (from 2% to 67%), while Bare Land decreased -51% (76% to 25%) and Vegetation decreased -12% (14% to 2%). Water coverage remained relatively stable (-2%). Confidence score: 98.4%.',
      badge: 'TRANSITION SUMMARY',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  if (query.includes('water') || query.includes('lake') || query.includes('river')) {
    return {
      sender: 'assistant',
      text: 'Water bodies decreased slightly from 8% in T1 to 6% in T2 (-2 percentage points). This represents minor seasonal surface area fluctuation in local retention basins rather than structural land use diversion.',
      badge: 'WATER -2%',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  if (query.includes('bare land') || query.includes('soil') || query.includes('desert')) {
    return {
      sender: 'assistant',
      text: 'Bare Land dropped from 76% in T1 to 25% in T2 (-51 percentage points). Most of this open terrain was repurposed for commercial and residential built environments.',
      badge: 'BARE LAND -51%',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  if (query.includes('pseudo') || query.includes('filter') || query.includes('noise') || query.includes('shadow')) {
    return {
      sender: 'assistant',
      text: 'The Pseudo-Change Filter eliminates false positives caused by solar zenith angle shifts, cloud shadows, and seasonal moisture variations. Applying the filter increases classification precision from 98.4% to 99.7%.',
      badge: 'FILTER PRECISION 99.7%',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  // Fallback intelligent response
  return {
    sender: 'assistant',
    text: `Based on multi-spectral satellite change intelligence for your query "${userQuery}": The dominant transition pattern in this temporal window is urban development, with building coverage increasing from 2% to 67% (+65%) primarily converting bare land (-51%) and vegetation (-12%).`,
    badge: 'SPECTRAL QUERY RESPONSE',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
};
