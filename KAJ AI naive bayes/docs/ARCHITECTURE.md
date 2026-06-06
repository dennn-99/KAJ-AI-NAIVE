# KAJ AI Architecture

## Text Pipeline

```text
Input Text
  -> Text Cleaning
  -> Tokenization
  -> TF-IDF Vectorization
  -> Naive Bayes Classification
  -> Risk Scoring Engine
  -> Explainable Report
```

The production text analyzer lives in `backend/app/services/text_pipeline.py`. It trains a `MultinomialNB` classifier with Indonesian starter data and combines model probability with explicit risk signals for clickbait, sensational wording, emotional manipulation, and unsupported claims.

## Multimodal API

All modalities return the same schema:

- Credibility Score
- Misinformation Risk Score
- AI Generated Probability
- Confidence Score
- Human-readable explanation

Image and audio analyzers are modular placeholders designed to be replaced by forensic image, ASR, and deepfake detection models.
