export type AnalysisResult = {
  credibility_score: number;
  misinformation_risk_score: number;
  ai_generated_probability: number;
  confidence_score: number;
  label: string;
  modality: "text" | "image" | "audio";
  risk_factors: string[];
  explanation: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function analyzeText(text: string, token?: string): Promise<AnalysisResult> {
  const response = await fetch(`${API_BASE_URL}/api/v1/analyze/text`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ text, source: "web", language: "id" })
  });
  if (!response.ok) {
    throw new Error("Analisis teks gagal");
  }
  return response.json();
}

export async function analyzeFile(kind: "image" | "audio", file: File, token?: string): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${API_BASE_URL}/api/v1/analyze/${kind}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData
  });
  if (!response.ok) {
    throw new Error(`Analisis ${kind} gagal`);
  }
  return response.json();
}
