# KAJ AI API Documentation

Base URL: `http://localhost:8000`

Authentication uses Bearer JWT.

## Register

`POST /api/v1/auth/register`

```json
{
  "email": "user@example.com",
  "password": "strong-password",
  "full_name": "User"
}
```

## Login

`POST /api/v1/auth/login`

```json
{
  "email": "user@example.com",
  "password": "strong-password"
}
```

## Analyze Text

`POST /api/v1/analyze/text`

```json
{
  "text": "Breaking! Pemerintah diam-diam menyembunyikan fakta besar tanpa bukti...",
  "source": "social_media",
  "language": "id"
}
```

## Analyze Image

`POST /api/v1/analyze/image`

Multipart form field: `file`

## Analyze Audio

`POST /api/v1/analyze/audio`

Multipart form field: `file`
