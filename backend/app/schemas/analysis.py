from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class TextAnalysisRequest(BaseModel):
    text: str = Field(min_length=20, max_length=20000)
    source: str = Field(default="unknown", max_length=100)
    language: str = Field(default="id", max_length=10)


class AnalysisResponse(BaseModel):
    credibility_score: int = Field(ge=0, le=100)
    misinformation_risk_score: int = Field(ge=0, le=100)
    ai_generated_probability: int = Field(ge=0, le=100)
    confidence_score: float = Field(ge=0, le=1)
    origin: str = Field(default="human")
    label: str
    modality: Literal["text", "image", "audio", "video"]
    content_type: str
    method: str
    risk_factors: list[str]
    recommendations: list[str]
    explanation: str


class AnalysisHistoryItem(BaseModel):
    id: int
    modality: str
    input_summary: str
    label: str
    credibility_score: int
    misinformation_risk_score: int
    ai_generated_probability: int
    confidence_score: float
    explanation: str
    created_at: datetime

    model_config = {"from_attributes": True}
