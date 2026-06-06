from app.services.text_pipeline import clean_text, text_analyzer, tokenize


def test_clean_text_removes_urls_and_lowercases() -> None:
    assert clean_text("VIRAL! https://contoh.id Fakta") == "viral fakta"


def test_tokenize_removes_indonesian_stopwords() -> None:
    assert "yang" not in tokenize("berita yang punya data resmi")


def test_text_analyzer_flags_misinformation_risk() -> None:
    result = text_analyzer.analyze("Viral sebelum dihapus, elit global menyembunyikan obat ajaib tanpa bukti.")
    assert result.misinformation_risk_score >= 50
    assert "Unsupported claim" in result.risk_factors


def test_text_analyzer_scores_credible_text() -> None:
    result = text_analyzer.analyze("Laporan resmi memuat data inflasi, dokumen metodologi, dan klarifikasi peneliti.")
    assert result.credibility_score >= 60
