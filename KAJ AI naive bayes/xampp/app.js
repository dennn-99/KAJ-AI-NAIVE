const STORAGE_KEY = "kaj_ai_training_dataset_v3";
const LEGACY_STORAGE_KEY = "kaj_ai_training_dataset_v2";

const defaultTrainingData = [
  createDefaultItem("human", "text", "id", "Pemerintah merilis data resmi inflasi dan menjelaskan metodologi penghitungan secara terbuka."),
  createDefaultItem("human", "text", "id", "Peneliti universitas mempublikasikan laporan dengan sumber data, batasan studi, dan tautan referensi."),
  createDefaultItem("human", "text", "id", "Laporan investigasi memuat wawancara lapangan, dokumen pengadilan, dan klarifikasi pihak terkait."),
  createDefaultItem("ai", "text", "id", "Konten ini menyajikan gambaran umum yang sangat terstruktur, netral, berulang, dan minim pengalaman langsung."),
  createDefaultItem("ai", "text", "id", "Sebagai model bahasa, teks ini merangkum manfaat, risiko, dan kesimpulan seimbang dengan pola kalimat generik."),
  createDefaultItem("human", "text", "en", "The reporter cited public records, interviewed residents, and explained what remains unknown in the investigation."),
  createDefaultItem("ai", "text", "en", "This content provides a balanced overview with advantages, disadvantages, and a concise structured conclusion."),
  createDefaultItem("human", "image", "auto", "foto asli dokumentasi kamera lapangan exif lokasi cahaya natural noise sensor bayangan konsisten"),
  createDefaultItem("ai", "image", "auto", "gambar ai generatif prompt ultra detailed smooth skin artifact tangan jari aneh latar tidak konsisten"),
  createDefaultItem("human", "audio", "auto", "rekaman suara manusia napas jeda alami noise ruangan intonasi spontan mikrofon lingkungan"),
  createDefaultItem("ai", "audio", "auto", "suara sintetis ai text to speech intonasi rata artikulasi terlalu bersih tanpa napas vocoder"),
  createDefaultItem("human", "video", "id", "video lapangan kamera bergerak alami suara sekitar bayangan konsisten wawancara spontan dokumentasi langsung"),
  createDefaultItem("ai", "video", "id", "video ai generated synthetic avatar lip sync tidak sinkron frame morphing wajah berubah prompt cinematic"),
  createDefaultItem("human", "video", "en", "real footage handheld camera ambient sound natural shadows imperfect focus live event recording"),
  createDefaultItem("ai", "video", "en", "ai video generated sora runway pika synthetic avatar lip sync artifacts temporal inconsistency"),
  createDefaultItem("human", "text", "de", "Der Bericht nennt offizielle Dokumente, direkte Interviews und offene Fragen zur Untersuchung."),
  createDefaultItem("ai", "text", "de", "Dieser Text bietet eine strukturierte und ausgewogene Ubersicht mit allgemeiner Zusammenfassung."),
  createDefaultItem("human", "text", "pt", "A reportagem cita documentos oficiais, entrevistas diretas e dados que ainda precisam ser confirmados."),
  createDefaultItem("ai", "text", "pt", "Este conteudo apresenta uma visao geral equilibrada com beneficios, riscos e conclusao resumida.")
];

const stopwordsByLanguage = {
  id: ["yang", "dan", "di", "ke", "dari", "ini", "itu", "untuk", "dengan", "pada", "adalah", "atau", "karena", "sebagai", "dalam", "akan", "telah", "tidak"],
  en: ["the", "and", "to", "of", "in", "a", "is", "for", "on", "with", "this", "that", "as", "by", "it", "from"],
  ms: ["yang", "dan", "di", "ke", "dari", "ini", "itu", "untuk", "dengan", "pada", "adalah", "atau", "kerana", "sebagai"],
  es: ["el", "la", "los", "las", "y", "de", "en", "un", "una", "para", "con", "por", "que", "es", "como"],
  fr: ["le", "la", "les", "et", "de", "des", "en", "un", "une", "pour", "avec", "par", "que", "est", "comme"],
  de: ["der", "die", "das", "und", "zu", "von", "in", "mit", "fur", "ist", "als", "nicht", "ein", "eine"],
  pt: ["o", "a", "os", "as", "e", "de", "em", "um", "uma", "para", "com", "por", "que", "como", "nao"]
};

const languageProfiles = {
  id: ["yang", "dan", "tidak", "dengan", "resmi", "laporan", "warga", "pemerintah", "berita", "sumber"],
  en: ["the", "and", "not", "with", "official", "report", "people", "government", "news", "source"],
  ms: ["yang", "dan", "tidak", "dengan", "rasmi", "laporan", "orang", "kerajaan", "berita", "sumber"],
  es: ["el", "la", "los", "las", "datos", "informe", "gobierno", "fuente", "noticia", "oficial"],
  fr: ["le", "la", "les", "donnees", "rapport", "gouvernement", "source", "nouvelle", "officiel", "avec"],
  de: ["der", "die", "bericht", "daten", "quelle", "regierung", "offiziell", "dokument", "nachricht", "mit"],
  pt: ["o", "a", "relatorio", "dados", "fonte", "governo", "oficial", "documento", "noticia", "com"]
};

const riskLexicons = {
  id: {
    sensational: ["viral", "heboh", "mengejutkan", "terbongkar", "rahasia", "skandal", "gempar", "klik", "sebelum dihapus", "pasti", "dijamin", "ajaib"],
    unsupported: ["tanpa bukti", "katanya", "konon", "sumber anonim", "tidak disebutkan", "disembunyikan", "kelompok rahasia", "elit global"],
    emotional: ["takut", "marah", "panik", "benci", "ancaman", "bahaya", "hancur", "musnah"],
    clickbait: ["tidak percaya", "lihat sendiri", "wajib tahu", "sebarkan segera", "jangan sampai", "sebelum terlambat"],
    source: ["data", "laporan", "dokumen", "riset", "jurnal", "resmi", "sumber"]
  },
  en: {
    sensational: ["viral", "shocking", "secret", "scandal", "exposed", "guaranteed", "miracle", "click"],
    unsupported: ["without evidence", "anonymous source", "hidden", "they do not want you to know", "secret group"],
    emotional: ["panic", "fear", "angry", "hate", "threat", "danger", "destroyed"],
    clickbait: ["you won't believe", "share now", "before it is deleted", "must know"],
    source: ["data", "report", "document", "research", "journal", "official", "source"]
  },
  ms: {
    sensational: ["viral", "gempar", "rahsia", "skandal", "terbongkar", "dijamin", "ajaib"],
    unsupported: ["tanpa bukti", "sumber anonim", "disembunyikan", "kumpulan rahsia"],
    emotional: ["panik", "takut", "marah", "benci", "bahaya"],
    clickbait: ["sebarkan segera", "sebelum dipadam", "wajib tahu"],
    source: ["data", "laporan", "dokumen", "kajian", "jurnal", "rasmi", "sumber"]
  },
  es: {
    sensational: ["viral", "impactante", "secreto", "escandalo", "garantizado", "milagro"],
    unsupported: ["sin pruebas", "fuente anonima", "oculto", "grupo secreto"],
    emotional: ["panico", "miedo", "odio", "amenaza", "peligro"],
    clickbait: ["no lo creeras", "comparte ahora", "antes de que lo borren"],
    source: ["datos", "informe", "documento", "investigacion", "revista", "oficial", "fuente"]
  },
  fr: {
    sensational: ["viral", "choquant", "secret", "scandale", "garanti", "miracle"],
    unsupported: ["sans preuve", "source anonyme", "cache", "groupe secret"],
    emotional: ["panique", "peur", "haine", "menace", "danger"],
    clickbait: ["vous ne croirez pas", "partagez maintenant", "avant suppression"],
    source: ["donnees", "rapport", "document", "recherche", "journal", "officiel", "source"]
  },
  de: {
    sensational: ["viral", "schockierend", "geheim", "skandal", "garantiert", "wunder"],
    unsupported: ["ohne beweise", "anonyme quelle", "versteckt", "geheime gruppe"],
    emotional: ["panik", "angst", "hass", "bedrohung", "gefahr"],
    clickbait: ["du wirst es nicht glauben", "jetzt teilen", "bevor es geloscht wird"],
    source: ["daten", "bericht", "dokument", "forschung", "journal", "offiziell", "quelle"]
  },
  pt: {
    sensational: ["viral", "chocante", "segredo", "escandalo", "garantido", "milagre"],
    unsupported: ["sem provas", "fonte anonima", "escondido", "grupo secreto"],
    emotional: ["panico", "medo", "odio", "ameaca", "perigo"],
    clickbait: ["voce nao vai acreditar", "compartilhe agora", "antes que seja removido"],
    source: ["dados", "relatorio", "documento", "pesquisa", "jornal", "oficial", "fonte"]
  }
};

const modalityNames = {
  text: "Teks / Konten",
  image: "Gambar",
  audio: "Suara",
  video: "Video"
};

let trainingData = loadTrainingData();
let aiModel = trainNaiveBayes(trainingData);
let modelVersion = 1;

function createDefaultItem(label, modality, language, text) {
  return {
    label,
    modality,
    language,
    text,
    link: "",
    fileName: "",
    fileType: "",
    fileSize: 0,
    createdAt: "Dataset bawaan"
  };
}

function loadTrainingData() {
  const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!saved) return [...defaultTrainingData];
  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || !parsed.length) return [...defaultTrainingData];
    return parsed.map(normalizeTrainingItem);
  } catch {
    return [...defaultTrainingData];
  }
}

function normalizeTrainingItem(item) {
  return {
    label: item.label === "ai" ? "ai" : "human",
    modality: ["text", "image", "audio", "video"].includes(item.modality) ? item.modality : "text",
    language: item.language || "auto",
    text: item.text || "",
    link: item.link || "",
    fileName: item.fileName || "",
    fileType: item.fileType || "",
    fileSize: Number(item.fileSize || 0),
    createdAt: item.createdAt || new Date().toLocaleString("id-ID")
  };
}

function saveTrainingData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trainingData));
}

function cleanText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/https?:\/\/\S+|www\.\S+/g, " ")
    .replace(/[^a-zA-Z0-9\u00C0-\u024F\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function detectLanguage(text) {
  const tokens = cleanText(text).split(" ").filter(Boolean);
  const scores = {};
  Object.entries(languageProfiles).forEach(([language, markers]) => {
    scores[language] = markers.reduce((score, marker) => score + (tokens.includes(marker) ? 1 : 0), 0);
  });
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return best && best[1] > 0 ? best[0] : "id";
}

function getStopwords(language) {
  const resolvedLanguage = language === "auto" ? "id" : language;
  return new Set([...(stopwordsByLanguage[resolvedLanguage] || []), ...stopwordsByLanguage.en]);
}

function tokenize(text, language = "auto") {
  const resolvedLanguage = language === "auto" ? detectLanguage(text) : language;
  const stopwords = getStopwords(resolvedLanguage);
  return cleanText(text)
    .split(" ")
    .filter((token) => token && !stopwords.has(token));
}

function composeItemText(item) {
  return [
    item.text,
    item.link,
    item.fileName,
    item.fileType,
    item.fileSize ? `ukuran file ${item.fileSize}` : ""
  ].filter(Boolean).join(" ");
}

function trainNaiveBayes(dataset) {
  const labels = ["human", "ai"];
  const vocabulary = new Set();
  const wordCounts = { human: {}, ai: {} };
  const totalWords = { human: 0, ai: 0 };
  const docCounts = { human: 0, ai: 0 };

  dataset.forEach((item) => {
    if (!labels.includes(item.label)) return;
    const text = composeItemText(item);
    docCounts[item.label] += 1;
    tokenize(text, item.language).forEach((token) => {
      vocabulary.add(token);
      wordCounts[item.label][token] = (wordCounts[item.label][token] || 0) + 1;
      totalWords[item.label] += 1;
    });
  });

  labels.forEach((label) => {
    if (docCounts[label] === 0) {
      docCounts[label] = 1;
      totalWords[label] = 1;
    }
  });

  return { labels, vocabulary, wordCounts, totalWords, docCounts, totalDocs: docCounts.human + docCounts.ai };
}

function getDatasetForModality(modality) {
  const scoped = trainingData.filter((item) => item.modality === modality);
  const hasHuman = scoped.some((item) => item.label === "human");
  const hasAi = scoped.some((item) => item.label === "ai");
  return hasHuman && hasAi ? scoped : trainingData;
}

function predictHumanAi(text, language, modality) {
  const dataset = getDatasetForModality(modality);
  const model = trainNaiveBayes(dataset);
  const tokens = tokenize(text, language);
  const vocabSize = Math.max(1, model.vocabulary.size);
  const scores = {};

  model.labels.forEach((label) => {
    let score = Math.log(model.docCounts[label] / model.totalDocs);
    tokens.forEach((token) => {
      const count = model.wordCounts[label][token] || 0;
      score += Math.log((count + 1) / (model.totalWords[label] + vocabSize));
    });
    scores[label] = score;
  });

  const maxScore = Math.max(scores.human, scores.ai);
  const humanExp = Math.exp(scores.human - maxScore);
  const aiExp = Math.exp(scores.ai - maxScore);
  const total = humanExp + aiExp;
  const topTokens = getTopTokens(tokens, model, 8);
  return {
    human: humanExp / total,
    ai: aiExp / total,
    confidence: Math.max(humanExp / total, aiExp / total),
    topTokens
  };
}

function getTopTokens(tokens, model, limit) {
  const uniqueTokens = [...new Set(tokens)];
  return uniqueTokens
    .map((token) => {
      const aiCount = model.wordCounts.ai[token] || 0;
      const humanCount = model.wordCounts.human[token] || 0;
      return { token, score: Math.abs(aiCount - humanCount), arah: aiCount >= humanCount ? "AI" : "Human" };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function includesAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function lexiconFor(language) {
  return riskLexicons[language] || riskLexicons.id;
}

function repeatedRatio(tokens) {
  return tokens.length ? 1 - new Set(tokens).size / tokens.length : 0;
}

function analyzeText(text, language) {
  const resolvedLanguage = language === "auto" ? detectLanguage(text) : language;
  const prediction = predictHumanAi(text, resolvedLanguage, "text");
  const tokens = tokenize(text, resolvedLanguage);
  const signals = extractTextRiskSignals(text, resolvedLanguage);
  const aiGeneratedProbability = clamp(Math.round(prediction.ai * 88 + repeatedRatio(tokens) * 12));
  const misinformationRiskScore = clamp(signals.penalty + Math.round(aiGeneratedProbability * 0.18));
  const credibilityScore = clamp(100 - misinformationRiskScore);
  const label = aiGeneratedProbability >= 65 ? "Konten AI" : credibilityScore >= 70 ? "Human / Kredibel" : "Perlu Pemeriksaan";

  if (aiGeneratedProbability >= 65) signals.factors.push("Pola konten mirip AI");

  return {
    credibilityScore,
    misinformationRiskScore,
    aiGeneratedProbability,
    confidenceScore: prediction.confidence,
    label,
    method: "Naive Bayes",
    language: resolvedLanguage,
    riskFactors: uniqueFactors(signals.factors),
    explanation: buildExplanation(label, credibilityScore, aiGeneratedProbability, signals.factors, resolvedLanguage),
    topTokens: prediction.topTokens
  };
}

function extractTextRiskSignals(text, language) {
  const cleaned = cleanText(text);
  const lexicon = lexiconFor(language);
  const factors = [];
  let penalty = 0;

  if (includesAny(cleaned, lexicon.sensational)) {
    factors.push("Bahasa sensasional");
    penalty += 12;
  }
  if (includesAny(cleaned, lexicon.unsupported)) {
    factors.push("Klaim tanpa dukungan");
    penalty += 16;
  }
  if (includesAny(cleaned, lexicon.emotional)) {
    factors.push("Manipulasi emosional");
    penalty += 10;
  }
  if (includesAny(cleaned, lexicon.clickbait)) {
    factors.push("Pola clickbait");
    penalty += 10;
  }
  if (!includesAny(cleaned, lexicon.source)) {
    factors.push("Sumber tidak jelas");
    penalty += 8;
  }

  return { factors, penalty };
}

function analyzeFile(file, modality) {
  const metadataText = buildFileMetadataText(file, modality);
  const prediction = predictHumanAi(metadataText, "auto", modality);
  const factors = ["Metadata file terbatas"];
  let risk = modality === "image" ? 24 : 30;

  if (file.size < minExpectedSize(modality)) {
    risk += 18;
    factors.push("Ukuran file sangat kecil");
  }

  if (!isExpectedMime(file, modality)) {
    risk += 12;
    factors.push("Tipe file tidak sesuai jenis data");
  }

  const aiGeneratedProbability = clamp(Math.round(prediction.ai * 82 + (file.size < 200000 ? 12 : 0)));
  if (aiGeneratedProbability >= 65) factors.push("Pola konten mirip AI");

  return {
    credibilityScore: clamp(100 - risk),
    misinformationRiskScore: clamp(risk + Math.round(aiGeneratedProbability * 0.1)),
    aiGeneratedProbability,
    confidenceScore: prediction.confidence,
    label: aiGeneratedProbability >= 65 ? "Konten AI" : "Human / Asli",
    method: "Naive Bayes",
    language: "auto",
    riskFactors: uniqueFactors(factors),
    explanation: "Model Naive Bayes menganalisis metadata file dan dataset pelatihan lokal. Tambahkan caption atau transkrip pada data pelatihan agar hasil gambar, suara, dan video lebih akurat.",
    topTokens: prediction.topTokens
  };
}

async function analyzeVideoContent(link, context, file, language) {
  const parts = [link, context];
  const factors = [];
  let risk = 28;

  if (file) {
    parts.push(buildFileMetadataText(file, "video"));
    factors.push("Metadata file terbatas");
    if (file.size < minExpectedSize("video")) {
      risk += 18;
      factors.push("Ukuran file sangat kecil");
    }
  }

  if (link) {
    parts.push(urlSignals(link).join(" "));
    const fetched = await tryFetchLinkText(link);
    if (fetched) {
      parts.push(fetched);
    } else {
      factors.push("Link tidak dapat dibaca browser");
      risk += 6;
    }
  }

  if (!context || context.trim().length < 30) {
    factors.push("Transkrip atau deskripsi belum tersedia");
    risk += 12;
  }

  const combinedText = parts.filter(Boolean).join(" ");
  const resolvedLanguage = language === "auto" ? detectLanguage(combinedText) : language;
  const prediction = predictHumanAi(combinedText, resolvedLanguage, "video");
  const tokens = tokenize(combinedText, resolvedLanguage);
  const aiTerms = ["ai", "generated", "sora", "runway", "pika", "synthetic", "avatar", "deepfake", "lip sync", "prompt", "morphing", "text to video", "video ai", "generatif"];
  if (includesAny(cleanText(combinedText), aiTerms)) {
    factors.push("Pola konten mirip AI");
    risk += 12;
  }

  const aiGeneratedProbability = clamp(Math.round(prediction.ai * 84 + repeatedRatio(tokens) * 16));
  const misinformationRiskScore = clamp(risk + Math.round(aiGeneratedProbability * 0.14));
  const credibilityScore = clamp(100 - misinformationRiskScore);

  return {
    credibilityScore,
    misinformationRiskScore,
    aiGeneratedProbability,
    confidenceScore: prediction.confidence,
    label: aiGeneratedProbability >= 65 ? "Konten AI" : "Human / Asli",
    method: "Naive Bayes",
    language: resolvedLanguage,
    riskFactors: uniqueFactors(factors.length ? factors : ["Tidak ada faktor risiko mayor"]),
    explanation: "Model Naive Bayes menganalisis link, metadata file, caption, transkrip, dan dataset video Human/AI lokal. Analisis isi frame-by-frame membutuhkan backend khusus.",
    topTokens: prediction.topTokens
  };
}

function buildFileMetadataText(file, modality) {
  return [
    modalityNames[modality],
    file.name,
    file.type,
    `ukuran ${file.size}`,
    file.lastModified ? `diubah ${new Date(file.lastModified).toLocaleDateString("id-ID")}` : ""
  ].filter(Boolean).join(" ");
}

function minExpectedSize(modality) {
  return { image: 5000, audio: 10000, video: 100000, text: 100 }[modality] || 100;
}

function isExpectedMime(file, modality) {
  if (!file.type) return true;
  if (modality === "image") return file.type.startsWith("image/");
  if (modality === "audio") return file.type.startsWith("audio/");
  if (modality === "video") return file.type.startsWith("video/");
  return file.type.startsWith("text/") || /\.(txt|md|csv|json)$/i.test(file.name);
}

function urlSignals(link) {
  try {
    const url = new URL(link);
    return [url.hostname, url.pathname.replace(/[-_/]/g, " "), url.search.replace(/[?=&]/g, " ")];
  } catch {
    return [link];
  }
}

async function tryFetchLinkText(link) {
  try {
    const response = await fetch(link, { mode: "cors" });
    if (!response.ok) return "";
    const html = await response.text();
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .slice(0, 3000);
  } catch {
    return "";
  }
}

function uniqueFactors(factors) {
  return [...new Set(factors.filter(Boolean))];
}

function buildExplanation(label, credibility, aiProbability, factors, language) {
  const factorText = uniqueFactors(factors).join(", ") || "tidak ada faktor risiko mayor";
  if (label === "Konten AI") {
    return `Model Naive Bayes menilai konten bahasa ${languageName(language)} ini memiliki pola mirip AI berdasarkan dataset pelatihan lokal. Faktor yang terdeteksi: ${factorText}.`;
  }
  if (credibility >= 70) {
    return `Model Naive Bayes menilai konten bahasa ${languageName(language)} ini relatif kredibel dengan skor ${credibility}%. Probabilitas AI terukur ${aiProbability}%.`;
  }
  return `Konten perlu pemeriksaan lanjutan karena ${factorText}. Model Naive Bayes menghitung probabilitas AI sebesar ${aiProbability}%.`;
}

function languageName(language) {
  const names = {
    id: "Indonesia",
    en: "English",
    ms: "Melayu",
    es: "Espanol",
    fr: "Francais",
    de: "Deutsch",
    pt: "Portugues",
    auto: "Deteksi Otomatis"
  };
  return names[language] || language;
}

function labelName(label) {
  return label === "ai" ? "AI Generated" : "Human";
}

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function trainingFileAccept(modality) {
  if (modality === "text") return ".txt,.md,.csv,.json,text/*";
  if (modality === "image") return "image/*";
  if (modality === "audio") return "audio/*";
  if (modality === "video") return "video/*";
  return "";
}

function isReadableTextFile(file) {
  return file && (file.type.startsWith("text/") || /\.(txt|md|csv|json)$/i.test(file.name));
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

async function buildTrainingPayload({ text, link, file, modality }) {
  const parts = [text, link ? urlSignals(link).join(" ") : ""];
  let fetchedLinkText = "";
  let fileText = "";

  if (link) {
    fetchedLinkText = await tryFetchLinkText(link);
    if (fetchedLinkText) parts.push(fetchedLinkText);
  }

  if (file) {
    parts.push(buildFileMetadataText(file, modality));
    if (modality === "text" && isReadableTextFile(file)) {
      fileText = await readFileAsText(file);
      parts.push(fileText);
    }
  }

  return {
    combinedText: parts.filter(Boolean).join(" ").trim(),
    fetchedLinkText,
    fileText
  };
}

async function buildTestText({ text, link, file, modality }) {
  const payload = await buildTrainingPayload({ text, link, file, modality });
  return payload.combinedText;
}

const navItems = document.querySelectorAll(".navItem");
const analysisView = document.querySelector("#analysisView");
const trainingView = document.querySelector("#trainingView");
const tabs = document.querySelectorAll(".tab");
const textInput = document.querySelector("#textInput");
const fileInput = document.querySelector("#fileInput");
const textLabel = document.querySelector("#textLabel");
const fileLabel = document.querySelector("#fileLabel");
const videoInputs = document.querySelector("#videoInputs");
const videoLinkInput = document.querySelector("#videoLinkInput");
const videoContextInput = document.querySelector("#videoContextInput");
const videoFileInput = document.querySelector("#videoFileInput");
const analyzeBtn = document.querySelector("#analyzeBtn");
const analysisLanguage = document.querySelector("#analysisLanguage");
const trainText = document.querySelector("#trainText");
const trainLink = document.querySelector("#trainLink");
const trainFile = document.querySelector("#trainFile");
const trainLabel = document.querySelector("#trainLabel");
const trainModality = document.querySelector("#trainModality");
const trainLanguage = document.querySelector("#trainLanguage");
const addTrainingBtn = document.querySelector("#addTrainingBtn");
const resetTrainingBtn = document.querySelector("#resetTrainingBtn");
const retrainBtn = document.querySelector("#retrainBtn");
const testText = document.querySelector("#testText");
const testLink = document.querySelector("#testLink");
const testFile = document.querySelector("#testFile");
const testModality = document.querySelector("#testModality");
const testLanguage = document.querySelector("#testLanguage");
const testModelBtn = document.querySelector("#testModelBtn");
const testResult = document.querySelector("#testResult");
let currentMode = "text";

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navItems.forEach((navItem) => navItem.classList.remove("active"));
    item.classList.add("active");
    const isTraining = item.dataset.view === "training";
    analysisView.classList.toggle("hidden", isTraining);
    trainingView.classList.toggle("hidden", !isTraining);
    renderTrainingList();
  });
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    currentMode = tab.dataset.mode;
    const isText = currentMode === "text";
    const isVideo = currentMode === "video";
    textInput.classList.toggle("hidden", !isText);
    textLabel.classList.toggle("hidden", !isText);
    videoInputs.classList.toggle("hidden", !isVideo);
    fileInput.classList.toggle("hidden", isText || isVideo);
    fileLabel.classList.toggle("hidden", isText || isVideo);
    fileInput.accept = currentMode === "image" ? "image/*" : "audio/*";
  });
});

trainModality.addEventListener("change", () => {
  trainFile.accept = trainingFileAccept(trainModality.value);
});

testModality.addEventListener("change", () => {
  testFile.accept = trainingFileAccept(testModality.value);
});

analyzeBtn.addEventListener("click", async () => {
  analyzeBtn.disabled = true;
  analyzeBtn.textContent = "Menganalisis";
  try {
    let result;
    if (currentMode === "text") {
      if (textInput.value.trim().length < 20) {
        alert("Masukkan teks minimal 20 karakter.");
        return;
      }
      result = analyzeText(textInput.value, analysisLanguage.value);
    } else if (currentMode === "video") {
      const link = videoLinkInput.value.trim();
      const context = videoContextInput.value.trim();
      const file = videoFileInput.files[0] || null;
      if (!link && !context && !file) {
        alert("Masukkan link video, transkrip/deskripsi, atau file video.");
        return;
      }
      result = await analyzeVideoContent(link, context, file, analysisLanguage.value);
    } else {
      const file = fileInput.files[0];
      if (!file) {
        alert("Pilih file terlebih dahulu.");
        return;
      }
      result = analyzeFile(file, currentMode);
    }
    renderResult(result);
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = "Analisis";
  }
});

addTrainingBtn.addEventListener("click", async () => {
  addTrainingBtn.disabled = true;
  addTrainingBtn.textContent = "Memproses";
  try {
    const file = trainFile.files[0] || null;
    const payload = await buildTrainingPayload({
      text: trainText.value.trim(),
      link: trainLink.value.trim(),
      file,
      modality: trainModality.value
    });

    if (payload.combinedText.length < 10) {
      alert("Isi data latih, link, atau upload file terlebih dahulu.");
      return;
    }

    trainingData.unshift({
      label: trainLabel.value,
      modality: trainModality.value,
      language: trainLanguage.value,
      text: payload.combinedText,
      link: trainLink.value.trim(),
      fileName: file ? file.name : "",
      fileType: file ? file.type : "",
      fileSize: file ? file.size : 0,
      createdAt: new Date().toLocaleString("id-ID")
    });

    saveTrainingData();
    retrainModel();
    trainText.value = "";
    trainLink.value = "";
    trainFile.value = "";
    renderTrainingList();
  } catch (error) {
    alert(`Gagal menambah data latih: ${error.message || error}`);
  } finally {
    addTrainingBtn.disabled = false;
    addTrainingBtn.textContent = "Tambah Data";
  }
});

retrainBtn.addEventListener("click", () => {
  retrainModel();
  renderTrainingList();
  alert("Model Naive Bayes Human / AI berhasil dilatih ulang.");
});

resetTrainingBtn.addEventListener("click", () => {
  if (!confirm("Reset dataset ke bawaan? Data tambahan lokal akan dihapus.")) return;
  trainingData = [...defaultTrainingData];
  saveTrainingData();
  retrainModel();
  renderTrainingList();
});

testModelBtn.addEventListener("click", async () => {
  testModelBtn.disabled = true;
  testModelBtn.textContent = "Menguji";
  try {
    const file = testFile.files[0] || null;
    const content = await buildTestText({
      text: testText.value.trim(),
      link: testLink.value.trim(),
      file,
      modality: testModality.value
    });

    if (content.length < 10) {
      alert("Isi teks/link atau upload file uji terlebih dahulu.");
      return;
    }

    const resolvedLanguage = testLanguage.value === "auto" ? detectLanguage(content) : testLanguage.value;
    const prediction = predictHumanAi(content, resolvedLanguage, testModality.value);
    renderTestResult(prediction, resolvedLanguage);
  } catch (error) {
    alert(`Gagal menguji model: ${error.message || error}`);
  } finally {
    testModelBtn.disabled = false;
    testModelBtn.textContent = "Uji Model";
  }
});

function retrainModel() {
  aiModel = trainNaiveBayes(trainingData);
  modelVersion += 1;
}

function renderResult(result) {
  document.querySelector("#emptyState").classList.add("hidden");
  document.querySelector("#result").classList.remove("hidden");
  setScore("credibility", result.credibilityScore);
  setScore("risk", result.misinformationRiskScore);
  setScore("ai", result.aiGeneratedProbability);
  document.querySelector("#methodText").textContent = result.method;
  document.querySelector("#languageText").textContent = languageName(result.language);
  document.querySelector("#confidenceText").textContent = `${Math.round(result.confidenceScore * 100)}%`;
  document.querySelector("#labelText").textContent = result.label;
  document.querySelector("#explanation").textContent = result.explanation;

  const list = document.querySelector("#riskFactors");
  list.innerHTML = "";
  result.riskFactors.forEach((factor) => {
    const item = document.createElement("li");
    item.textContent = factor;
    list.appendChild(item);
  });
}

function setScore(id, value) {
  document.querySelector(`#${id}Text`).textContent = `${value}%`;
  document.querySelector(`#${id}Bar`).style.width = `${value}%`;
}

function renderTestResult(prediction, language) {
  const aiPercent = Math.round(prediction.ai * 100);
  const humanPercent = Math.round(prediction.human * 100);
  const label = prediction.ai >= prediction.human ? "AI Generated" : "Human";
  const tokenText = prediction.topTokens.length
    ? prediction.topTokens.map((item) => `${item.token} (${item.arah})`).join(", ")
    : "Token penting belum cukup terlihat.";

  testResult.classList.remove("hidden");
  testResult.innerHTML = `
    <div class="metric">
      <div class="metricHeader"><span>Probabilitas AI</span><strong>${aiPercent}%</strong></div>
      <div class="bar"><div class="barFill warn" style="width: ${aiPercent}%"></div></div>
    </div>
    <div class="metric">
      <div class="metricHeader"><span>Probabilitas Human</span><strong>${humanPercent}%</strong></div>
      <div class="bar"><div class="barFill good" style="width: ${humanPercent}%"></div></div>
    </div>
    <p><strong>Prediksi:</strong> ${label}</p>
    <p><strong>Bahasa:</strong> ${languageName(language)}</p>
    <p><strong>Kepercayaan:</strong> ${Math.round(prediction.confidence * 100)}%</p>
    <p><strong>Token/faktor utama:</strong> ${escapeHtml(tokenText)}</p>
    <p><strong>Versi model:</strong> ${modelVersion}</p>
  `;
}

function renderTrainingList() {
  document.querySelector("#totalCount").textContent = trainingData.length;
  document.querySelector("#humanCount").textContent = trainingData.filter((item) => item.label === "human").length;
  document.querySelector("#aiCount").textContent = trainingData.filter((item) => item.label === "ai").length;
  document.querySelector("#languageCount").textContent = new Set(trainingData.map((item) => item.language)).size;
  document.querySelector("#modalityCount").textContent = new Set(trainingData.map((item) => item.modality)).size;

  const list = document.querySelector("#trainingList");
  list.innerHTML = "";
  trainingData.forEach((item, index) => {
    const node = document.createElement("article");
    node.className = "trainingItem";
    const detail = [
      item.link ? `Link: ${item.link}` : "",
      item.fileName ? `File: ${item.fileName} (${item.fileType || "tipe tidak diketahui"}, ${item.fileSize} byte)` : ""
    ].filter(Boolean).join(" | ");
    node.innerHTML = `
      <div class="trainingMeta">
        <span><span class="pill">${labelName(item.label)}</span> ${modalityNames[item.modality]} / ${languageName(item.language)}</span>
        <button class="deleteBtn" data-index="${index}" aria-label="Hapus data latih">Hapus</button>
      </div>
      <div>${escapeHtml(item.text.slice(0, 220))}${item.text.length > 220 ? "..." : ""}</div>
      ${detail ? `<div class="trainingDetail">${escapeHtml(detail)}</div>` : ""}
      <div class="trainingDetail">Dibuat: ${escapeHtml(item.createdAt)}</div>
    `;
    list.appendChild(node);
  });

  document.querySelectorAll(".deleteBtn").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      trainingData.splice(index, 1);
      saveTrainingData();
      retrainModel();
      renderTrainingList();
    });
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

trainFile.accept = trainingFileAccept(trainModality.value);
testFile.accept = trainingFileAccept(testModality.value);
renderTrainingList();
