import { MOCK_CHANGE_SUMMARY, MOCK_TRANSITION_MATRIX, SAMPLE_PRESETS } from './data/mockData';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const ANALYZE_ENDPOINT = import.meta.env.VITE_ANALYZE_ENDPOINT || '/api/analyze';
const IMAGE_QUALITY_ENDPOINT = import.meta.env.VITE_IMAGE_QUALITY_ENDPOINT || '/api/check-image-quality';
const CHAT_ENDPOINT = import.meta.env.VITE_CHAT_ENDPOINT || '/api/chat';

const apiUrl = (endpoint) => {
  if (/^https?:\/\//i.test(endpoint)) return endpoint;
  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

const readResponse = async (response) => {
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message = body?.error || body?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }
  return body;
};

const firstDefined = (...values) => values.find((value) => value !== undefined && value !== null);

const dataUrlToFile = async (dataUrl, name) => {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], name, { type: blob.type || 'image/svg+xml' });
};

const normalizeTransition = (item) => ({
  category: firstDefined(item.category, item.class, item.name, 'UNKNOWN').toString().toUpperCase(),
  t1Percent: Number(firstDefined(item.t1Percent, item.t1_percent, item.before, item.t1, 0)),
  t2Percent: Number(firstDefined(item.t2Percent, item.t2_percent, item.after, item.t2, 0)),
  changePercent: Number(firstDefined(item.changePercent, item.change_percent, item.delta, 0)),
  color: firstDefined(item.color, '#00f0ff'),
  description: firstDefined(item.description, item.details, ''),
  filteredNoiseDelta: Number(firstDefined(item.filteredNoiseDelta, item.filtered_noise_delta, 0))
});

export const normalizeAnalysisResponse = (body) => {
  const data = body?.data || body?.result || body;
  const transitions = firstDefined(
    data?.transitionMatrix,
    data?.transition_matrix,
    data?.changes,
    data?.classes,
    []
  );
  const summary = firstDefined(data?.summary, data?.changeSummary, data?.change_summary, {});

  return {
    transitionMatrix: Array.isArray(transitions) ? transitions.map(normalizeTransition) : [],
    summary: {
      totalAnalyzedAreaKm2: Number(firstDefined(
        summary.totalAnalyzedAreaKm2,
        summary.total_analyzed_area_km2,
        data?.totalAnalyzedAreaKm2,
        data?.total_analyzed_area_km2,
        0
      )),
      primaryVector: firstDefined(summary.primaryVector, summary.primary_vector, data?.primaryVector, ''),
      netClassShiftPercent: Number(firstDefined(
        summary.netClassShiftPercent,
        summary.net_class_shift_percent,
        data?.netClassShiftPercent,
        data?.net_class_shift_percent,
        0
      )),
      confidenceScore: Number(firstDefined(summary.confidenceScore, summary.confidence_score, data?.confidenceScore, 0)),
      filteredConfidenceScore: Number(firstDefined(
        summary.filteredConfidenceScore,
        summary.filtered_confidence_score,
        data?.filteredConfidenceScore,
        data?.filtered_confidence_score,
        summary.confidenceScore,
        0
      ))
    },
    maskSrc: firstDefined(data?.maskSrc, data?.mask_src, data?.maskUrl, data?.mask_url, null),
    raw: data
  };
};

export const analyzeImages = async ({ t1File, t2File, t1Image, t2Image }) => {
  if (!t1File && !t2File) {
    return normalizeAnalysisResponse({
      transitionMatrix: MOCK_TRANSITION_MATRIX,
      summary: MOCK_CHANGE_SUMMARY,
      maskSrc: SAMPLE_PRESETS[0].maskSrc
    });
  }

  const formData = new FormData();
  const beforeImage = t1File || await dataUrlToFile(t1Image, 'before-image');
  const afterImage = t2File || await dataUrlToFile(t2Image, 'after-image');
  formData.append('beforeImage', beforeImage, beforeImage.name);
  formData.append('afterImage', afterImage, afterImage.name);

  let response;
  try {
    response = await fetch(apiUrl(ANALYZE_ENDPOINT), {
      method: 'POST',
      body: formData
    });
  } catch {
    throw new Error('The image analysis service is unreachable. Start the backend or configure VITE_API_BASE_URL to analyze uploaded images.');
  }

  return normalizeAnalysisResponse(await readResponse(response));
};

export const checkImageQuality = async ({ t1File, t2File, t1Image, t2Image }) => {
  if ((!t1File && !t1Image) || (!t2File && !t2Image)) {
    throw new Error('Both temporal images are required for pseudo-change filtering.');
  }

  const formData = new FormData();
  const beforeImage = t1File || await dataUrlToFile(t1Image, 'before-image');
  const afterImage = t2File || await dataUrlToFile(t2Image, 'after-image');
  formData.append('beforeImage', beforeImage, beforeImage.name);
  formData.append('afterImage', afterImage, afterImage.name);

  let response;
  try {
    response = await fetch(apiUrl(IMAGE_QUALITY_ENDPOINT), {
      method: 'POST',
      body: formData
    });
  } catch {
    throw new Error('The image quality service is unreachable. Start the backend or configure VITE_API_BASE_URL.');
  }

  const body = await readResponse(response);
  if (!body?.data) {
    throw new Error('The image quality service returned an invalid response.');
  }
  return body.data;
};

export const askChangeQuestion = async ({ query, analysis }) => {
  const response = await fetch(apiUrl(CHAT_ENDPOINT), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: query,
      analysisContext: analysis?.raw || analysis || null
    })
  });
  const body = await readResponse(response);
  const data = body?.data || body?.result || body;

  return {
    sender: 'assistant',
    text: firstDefined(data?.text, data?.message, data?.response, data?.answer, body?.reply, ''),
    badge: firstDefined(data?.badge, data?.label, 'SPECTRAL QUERY RESPONSE'),
    timestamp: firstDefined(data?.timestamp, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
  };
};
