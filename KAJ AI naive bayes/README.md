# KAJ AI

KAJ AI adalah platform deteksi misinformasi multimodal untuk artikel berita, postingan media sosial, gambar, dan audio. Fokus utama analisis teks adalah Bahasa Indonesia dengan model utama `Multinomial Naive Bayes` di atas pipeline cleaning, tokenization, TF-IDF, classification, risk scoring, dan laporan explainable.

## Fitur

- FastAPI backend dengan JWT authentication
- Pipeline teks: cleaning, tokenization, TF-IDF, Naive Bayes, risk scoring, explainable report
- Analisis multimodal untuk teks, gambar, dan audio
- PostgreSQL database untuk user dan riwayat analisis
- Rate limiting per IP/token
- Next.js frontend
- Docker dan docker-compose
- Unit tests

## Struktur

```text
backend/
  app/
    api/
    core/
    db/
    models/
    schemas/
    services/
  tests/
frontend/
  app/
  components/
  lib/
docs/
```

## Menjalankan dengan Docker

```bash
docker compose up --build
```

Frontend: http://localhost:3000  
Backend API: http://localhost:8000  
Swagger: http://localhost:8000/docs

## Menjalankan via XAMPP

Untuk penggunaan lokal sederhana di Chrome melalui XAMPP, gunakan folder `xampp`.

Cara paling mudah: jalankan `open-kaj-ai-xampp.bat`, lalu pastikan Apache XAMPP aktif. Script akan mencari folder `htdocs`, menyalin app ke `[htdocs]\kaj-ai`, dan membuka `http://localhost/kaj-ai/`.

Cara manual:

1. Salin folder `xampp` ke `htdocs`.
2. Jalankan Apache dari XAMPP Control Panel.
3. Buka `http://localhost/kaj-ai/` jika folder dinamai `kaj-ai`, atau `http://localhost/xampp/` jika nama folder tetap `xampp`.

Versi XAMPP berjalan sepenuhnya di browser dan tidak membutuhkan Node.js/FastAPI.

Versi XAMPP juga memiliki menu `Data Pelatihan` untuk menambah dataset `Human` dan `AI Generated` untuk teks/konten, gambar, suara, dan video dalam beberapa bahasa, termasuk Indonesia.

## Menjalankan Backend Lokal

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Menjalankan Frontend Lokal

```bash
cd frontend
npm install
npm run dev
```

## Endpoint Utama

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/analyze/text`
- `POST /api/v1/analyze/image`
- `POST /api/v1/analyze/audio`
- `GET /api/v1/history`

Contoh output:

```json
{
  "credibility_score": 82,
  "misinformation_risk_score": 18,
  "ai_generated_probability": 21,
  "confidence_score": 0.87,
  "label": "credible",
  "risk_factors": ["Unsupported claim"],
  "explanation": "Teks relatif kredibel, tetapi ada klaim yang membutuhkan sumber pendukung."
}
```

## Catatan Produksi

Dataset bawaan berukuran kecil agar repository langsung berjalan. Untuk produksi, ganti `backend/app/models/text_training_data.py` dengan dataset Bahasa Indonesia yang lebih besar dan tervalidasi, lalu persist model terlatih melalui registry model internal.
