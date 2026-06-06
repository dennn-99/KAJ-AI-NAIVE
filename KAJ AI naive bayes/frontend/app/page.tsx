"use client";

import { FileAudio, FileImage, Newspaper, ScanSearch } from "lucide-react";
import { useState } from "react";

import { ScoreGauge } from "@/components/ScoreGauge";
import { AnalysisResult, analyzeFile, analyzeText } from "@/lib/api";

type Mode = "text" | "image" | "audio";

export default function Home() {
  const [mode, setMode] = useState<Mode>("text");
  const [text, setText] = useState("Viral sebelum dihapus, klaim ini tanpa bukti dan membuat warga panik.");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runAnalysis() {
    setLoading(true);
    setError("");
    try {
      const nextResult = mode === "text" ? await analyzeText(text) : file ? await analyzeFile(mode, file) : null;
      if (!nextResult) {
        throw new Error("Pilih file terlebih dahulu");
      }
      setResult(nextResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analisis gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <h1 className="brand">KAJ AI</h1>
        <p className="muted">Platform deteksi misinformasi multimodal untuk teks, gambar, dan audio.</p>
      </aside>

      <section className="main">
        <div className="toolbar">
          <div className="tabs" role="tablist">
            <button className={`tab ${mode === "text" ? "active" : ""}`} onClick={() => setMode("text")}>
              <Newspaper size={16} /> Teks
            </button>
            <button className={`tab ${mode === "image" ? "active" : ""}`} onClick={() => setMode("image")}>
              <FileImage size={16} /> Gambar
            </button>
            <button className={`tab ${mode === "audio" ? "active" : ""}`} onClick={() => setMode("audio")}>
              <FileAudio size={16} /> Audio
            </button>
          </div>
        </div>

        <div className="workspace">
          <section className="panel">
            {mode === "text" ? (
              <textarea value={text} onChange={(event) => setText(event.target.value)} aria-label="Teks untuk dianalisis" />
            ) : (
              <input
                className="fileInput"
                type="file"
                accept={mode === "image" ? "image/*" : "audio/*"}
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              />
            )}
            <button className="primary" onClick={runAnalysis} disabled={loading}>
              <ScanSearch size={18} />
              {loading ? "Menganalisis" : "Analisis"}
            </button>
            {error ? <p className="muted">{error}</p> : null}
          </section>

          <aside className="panel">
            {result ? (
              <>
                <ScoreGauge label="Credibility Score" value={result.credibility_score} tone="good" />
                <ScoreGauge label="Misinformation Risk" value={result.misinformation_risk_score} tone="risk" />
                <ScoreGauge label="AI Generated Probability" value={result.ai_generated_probability} tone="warn" />
                <p><strong>Confidence:</strong> {Math.round(result.confidence_score * 100)}%</p>
                <p><strong>Label:</strong> {result.label}</p>
                <ul className="riskList">
                  {result.risk_factors.map((factor) => (
                    <li key={factor}>{factor}</li>
                  ))}
                </ul>
                <p>{result.explanation}</p>
              </>
            ) : (
              <div className="empty">Hasil analisis akan tampil di sini.</div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
