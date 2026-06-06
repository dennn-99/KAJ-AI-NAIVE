from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_analyze_text() -> None:
    response = client.post(
        "/api/v1/analyze/text",
        json={"text": "Viral sebelum dihapus, klaim ini tanpa bukti dan membuat warga panik.", "source": "social_media"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["modality"] == "text"
    assert 0 <= body["credibility_score"] <= 100
