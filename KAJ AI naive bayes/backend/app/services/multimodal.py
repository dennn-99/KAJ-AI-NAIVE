from fastapi import UploadFile

from app.schemas.analysis import AnalysisResponse


IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
AUDIO_EXTENSIONS = {".mp3", ".wav", ".m4a", ".ogg", ".flac"}
VIDEO_EXTENSIONS = {".mp4", ".mov", ".webm", ".mkv", ".avi"}


def clamp_score(value: int) -> int:
    return max(0, min(100, value))


def media_recommendations(modality: str, risk: int) -> list[str]:
    recommendations = [
        "Bandingkan dengan sumber asli, tanggal unggah, dan konteks kejadian.",
        "Gunakan reverse image/video search atau kanal resmi jika konten berdampak publik.",
    ]
    if modality in {"audio", "video"}:
        recommendations.append("Validasi transkrip, sinkronisasi suara-bibir, dan jejak edit sebelum menyimpulkan.")
    if risk >= 50:
        recommendations.append("Tahan publikasi ulang sampai ada verifikasi independen.")
    return recommendations


async def analyze_image(file: UploadFile) -> AnalysisResponse:
    content = await file.read()
    size = len(content)
    risk = 25
    factors = ["Image metadata unavailable"]

    if size < 5_000:
        risk += 20
        factors.append("Very small file size")
    if file.content_type not in {"image/jpeg", "image/png", "image/webp", "image/gif"}:
        risk += 15
        factors.append("Unexpected image MIME type")

    ai_probability = clamp_score(35 + (10 if size < 100_000 else 0))
    risk = clamp_score(risk)
    credibility = clamp_score(100 - risk)
    
    origin = "ai generated" if ai_probability >= 60 else "human"
    status = "valid" if credibility >= 70 else "hoaks" if credibility < 45 else "needs review"

    return AnalysisResponse(
        credibility_score=credibility,
        misinformation_risk_score=risk,
        ai_generated_probability=ai_probability,
        confidence_score=0.58,
        origin=origin,
        label=f"{origin} / {status}",
        modality="image",
        content_type="gambar",
        method="Metadata Heuristic + Media Risk Classifier",
        risk_factors=factors,
        recommendations=media_recommendations("image", risk),
        explanation="Analisis gambar awal berbasis metadata, MIME type, dan sinyal ukuran file. Untuk produksi, hubungkan model forensik gambar khusus agar artefak piksel dan EXIF dapat divalidasi lebih dalam.",
    )


async def analyze_audio(file: UploadFile) -> AnalysisResponse:
    content = await file.read()
    size = len(content)
    risk = 30
    factors = ["Transcript unavailable"]

    if size < 10_000:
        risk += 20
        factors.append("Very short or compressed audio payload")
    if file.content_type not in {"audio/mpeg", "audio/wav", "audio/x-wav", "audio/mp4", "audio/ogg", "audio/flac"}:
        risk += 15
        factors.append("Unexpected audio MIME type")

    ai_probability = clamp_score(40 + (15 if size < 200_000 else 0))
    risk = clamp_score(risk)
    credibility = clamp_score(100 - risk)

    origin = "ai generated" if ai_probability >= 60 else "human"
    status = "valid" if credibility >= 70 else "hoaks" if credibility < 45 else "needs review"

    return AnalysisResponse(
        credibility_score=credibility,
        misinformation_risk_score=risk,
        ai_generated_probability=ai_probability,
        confidence_score=0.52,
        origin=origin,
        label=f"{origin} / {status}",
        modality="audio",
        content_type="audio",
        method="Metadata Heuristic + Audio Risk Classifier",
        risk_factors=factors,
        recommendations=media_recommendations("audio", risk),
        explanation="Analisis audio awal berbasis metadata dan tipe file. Untuk produksi, hubungkan modul ASR, speaker verification, dan deepfake-audio detector.",
    )


async def analyze_video(link: str = "", context: str = "", file: UploadFile | None = None) -> AnalysisResponse:
    factors: list[str] = []
    risk = 28
    ai_probability = 34

    combined_text = f"{link} {context}".lower()
    synthetic_terms = [
        "deepfake",
        "ai generated",
        "generated video",
        "sora",
        "runway",
        "pika",
        "avatar",
        "lip sync",
        "morphing",
        "text to video",
        "video ai",
        "generatif",
    ]
    if any(term in combined_text for term in synthetic_terms):
        factors.append("Synthetic video terms detected")
        risk += 14
        ai_probability += 24

    if link:
        factors.append("External video link requires source verification")
        if any(domain in link.lower() for domain in ["bit.ly", "tinyurl", "t.co"]):
            factors.append("Shortened or obscured link")
            risk += 10

    if not context or len(context.strip()) < 30:
        factors.append("Transcript or caption unavailable")
        risk += 12

    if file is not None:
        content = await file.read()
        size = len(content)
        factors.append("Video metadata only; frame-by-frame analysis unavailable")
        if size < 100_000:
            factors.append("Very small video payload")
            risk += 18
            ai_probability += 10
        if file.content_type and not file.content_type.startswith("video/"):
            factors.append("Unexpected video MIME type")
            risk += 15

    if not link and not context and file is None:
        factors.append("No video evidence submitted")
        risk += 20

    risk = clamp_score(risk)
    ai_probability = clamp_score(ai_probability)
    credibility = clamp_score(100 - risk)
    
    origin = "ai generated" if ai_probability >= 60 else "human"
    status = "valid" if credibility >= 70 else "hoaks" if credibility < 45 else "needs review"

    return AnalysisResponse(
        credibility_score=credibility,
        misinformation_risk_score=risk,
        ai_generated_probability=ai_probability,
        confidence_score=0.5 if file is None else 0.56,
        origin=origin,
        label=f"{origin} / {status}",
        modality="video",
        content_type="video/link",
        method="Metadata + Caption/Transcript Video Risk Classifier",
        risk_factors=factors or ["No major risk factor detected"],
        recommendations=media_recommendations("video", risk),
        explanation="Analisis video memakai link, metadata file, caption, dan/atau transkrip. Hasil ini adalah triase awal; validasi produksi perlu ekstraksi frame, audio, dan detector deepfake video khusus.",
    )
