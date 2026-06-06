import re
from dataclasses import dataclass

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline

from app.models.text_training_data import TRAINING_LABELS, TRAINING_TEXTS
from app.schemas.analysis import AnalysisResponse


INDONESIAN_STOPWORDS = {
    "yang", "dan", "di", "ke", "dari", "ini", "itu", "untuk", "dengan", "pada",
    "adalah", "atau", "karena", "sebagai", "dalam", "akan", "telah", "tidak",
}

SENSATIONAL_TERMS = {
    "viral", "heboh", "mengejutkan", "terbongkar", "rahasia", "skandal", "gempar",
    "klik", "sebelum dihapus", "pasti", "dijamin", "ajaib",
}

UNSUPPORTED_CLAIM_TERMS = {
    "tanpa bukti", "katanya", "konon", "sumber anonim", "tidak disebutkan",
    "disembunyikan", "kelompok rahasia", "elit global",
}

EMOTIONAL_TERMS = {
    "takut", "marah", "panik", "benci", "ancaman", "bahaya", "hancur", "musnah",
}

CLICKBAIT_TERMS = {
    "nomor", "tidak percaya", "lihat sendiri", "wajib tahu", "sebarkan segera",
    "jangan sampai", "sebelum terlambat",
}


def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"https?://\S+|www\.\S+", " ", text)
    text = re.sub(r"[^a-zA-Z0-9\u00C0-\u024F\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def tokenize(text: str) -> list[str]:
    return [token for token in clean_text(text).split() if token not in INDONESIAN_STOPWORDS]


@dataclass(frozen=True)
class RiskSignals:
    factors: list[str]
    penalty: int
    ai_probability: int


class IndonesianTextAnalyzer:
    def __init__(self) -> None:
        self.pipeline = Pipeline(
            steps=[
                ("tfidf", TfidfVectorizer(preprocessor=clean_text, tokenizer=tokenize, token_pattern=None, ngram_range=(1, 3))),
                ("classifier", MultinomialNB(alpha=0.1)),
            ]
        )
        self.pipeline.fit(TRAINING_TEXTS, TRAINING_LABELS)

    def _detect_language(self, text: str) -> str:
        tokens = clean_text(text).split()
        if not tokens:
            return "id"
        
        id_markers = {"yang", "dan", "di", "ini", "itu", "untuk", "adalah", "dengan"}
        en_markers = {"the", "and", "is", "for", "with", "that", "this", "from"}
        
        id_score = sum(1 for t in tokens if t in id_markers)
        en_score = sum(1 for t in tokens if t in en_markers)
        
        return "id" if id_score >= en_score else "en"

    def analyze(self, text: str, source: str = "unknown", language: str = "id") -> AnalysisResponse:
        detected_lang = self._detect_language(text) if language == "auto" else language
        probabilities = self.pipeline.predict_proba([text])[0]
        classes = list(self.pipeline.classes_)
        mis_index = classes.index("misinformation") if "misinformation" in classes else 0
        misinformation_prob = float(probabilities[mis_index])
        confidence = float(np.max(probabilities))
        signals = self._extract_risk_signals(text, source)

        risk_score = min(100, round(misinformation_prob * 75) + signals.penalty)
        credibility_score = max(0, 100 - risk_score)
        
        origin = "ai generated" if signals.ai_probability >= 60 else "human"
        status = "valid" if credibility_score >= 70 else "hoaks" if credibility_score < 45 else "needs_review"
        
        # Sesuai permintaan: Jika hoaks, kita beri penekanan pada risiko tinggi (bisa dianggap buatan AI/bot)
        label = f"{origin} / {status}"

        explanation = self._build_explanation(status, credibility_score, signals.factors, source, detected_lang)
        return AnalysisResponse(
            credibility_score=credibility_score,
            misinformation_risk_score=risk_score,
            ai_generated_probability=signals.ai_probability,
            confidence_score=round(confidence, 2),
            origin=origin,
            label=label,
            modality="text",
            content_type=self._content_type(source),
            method="TF-IDF + Naive Bayes",
            risk_factors=signals.factors,
            recommendations=self._build_recommendations(label, signals.factors),
            explanation=explanation,
        )

    def _extract_risk_signals(self, text: str, source: str) -> RiskSignals:
        cleaned = clean_text(text)
        factors: list[str] = []
        penalty = 0

        checks = [
            ("Sensational wording", SENSATIONAL_TERMS, 12),
            ("Unsupported claim", UNSUPPORTED_CLAIM_TERMS, 16),
            ("Emotional manipulation", EMOTIONAL_TERMS, 10),
            ("Clickbait pattern", CLICKBAIT_TERMS, 10),
        ]
        for label, terms, weight in checks:
            if any(term in cleaned for term in terms):
                factors.append(label)
                penalty += weight

        has_source_signal = any(term in cleaned for term in ["data", "laporan", "dokumen", "riset", "jurnal", "resmi"])
        if not has_source_signal:
            factors.append("Suspicious or missing source")
            penalty += 8

        if source == "social_media" and any(term in cleaned for term in ["share", "bagikan", "sebarkan", "forward"]):
            factors.append("Viral sharing pressure")
            penalty += 8

        if source == "news_article" and not any(term in cleaned for term in ["wawancara", "narasumber", "redaksi", "klarifikasi"]):
            factors.append("News article lacks reporting context")
            penalty += 6

        tokens = tokenize(cleaned)
        repeated_ratio = 0 if not tokens else 1 - (len(set(tokens)) / len(tokens))
        generic_ai_terms = ["sebagai model", "secara keseluruhan", "kesimpulannya", "balanced overview", "in conclusion"]
        ai_boost = 18 if any(term in cleaned for term in generic_ai_terms) else 0
        ai_probability = min(100, round(18 + repeated_ratio * 64 + max(0, len(tokens) - 180) * 0.08 + ai_boost))
        return RiskSignals(factors=factors or ["No major risk factor detected"], penalty=penalty, ai_probability=ai_probability)

    def _content_type(self, source: str) -> str:
        if source == "social_media":
            return "postingan media sosial"
        if source == "news_article":
            return "artikel berita"
        return "teks"

    def _build_recommendations(self, label: str, factors: list[str]) -> list[str]:
        if label == "valid":
            return ["Tetap cocokkan dengan sumber primer jika konten akan dipublikasikan ulang."]
        recommendations = ["Periksa sumber primer, tanggal kejadian, dan konteks asli sebelum membagikan."]
        if "Unsupported claim" in factors or "Suspicious or missing source" in factors:
            recommendations.append("Cari rujukan resmi atau liputan pembanding dari media kredibel.")
        if "Viral sharing pressure" in factors or "Clickbait pattern" in factors:
            recommendations.append("Jangan teruskan konten hanya karena ada ajakan sebarkan segera.")
        return recommendations

    def _build_explanation(self, label: str, credibility: int, factors: list[str], source: str, language: str) -> str:
        factor_text = ", ".join(factors)
        content_type = self._content_type(source)
        if label == "valid":
            return f"{content_type.capitalize()} bahasa {language} tampak relatif valid dengan skor kredibilitas {credibility}%. Faktor yang tetap perlu diperhatikan: {factor_text}."
        if label == "needs_review":
            return f"{content_type.capitalize()} membutuhkan pemeriksaan lanjutan. Beberapa sinyal risiko terdeteksi: {factor_text}."
        return f"{content_type.capitalize()} berisiko hoaks/misinformasi tinggi karena memuat sinyal seperti: {factor_text}."


text_analyzer = IndonesianTextAnalyzer()
