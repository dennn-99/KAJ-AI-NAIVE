from fastapi import APIRouter, Depends, File, Form, Request, UploadFile
from sqlalchemy.orm import Session

from app.api.deps import get_optional_user
from app.core.config import settings
from app.core.limiter import limiter
from app.db.models import Analysis, User
from app.db.session import get_db
from app.schemas.analysis import AnalysisResponse, TextAnalysisRequest
from app.services.multimodal import analyze_audio, analyze_image, analyze_video
from app.services.text_pipeline import text_analyzer


router = APIRouter()


def persist_analysis(
    db: Session,
    result: AnalysisResponse,
    input_summary: str,
    user: User | None,
) -> None:
    db.add(
        Analysis(
            user_id=user.id if user else None,
            modality=result.modality,
            input_summary=input_summary[:500],
            origin=result.origin,
            label=result.label,
            credibility_score=result.credibility_score,
            misinformation_risk_score=result.misinformation_risk_score,
            ai_generated_probability=result.ai_generated_probability,
            confidence_score=round(result.confidence_score * 100),
            explanation=result.explanation,
        )
    )
    db.commit()


@router.post("/text", response_model=AnalysisResponse)
@limiter.limit(settings.rate_limit_default)
def analyze_text(
    request: Request,
    payload: TextAnalysisRequest,
    db: Session = Depends(get_db),
    user: User | None = Depends(get_optional_user),
) -> AnalysisResponse:
    result = text_analyzer.analyze(payload.text, source=payload.source, language=payload.language)
    persist_analysis(db, result, payload.text, user)
    return result


@router.post("/image", response_model=AnalysisResponse)
@limiter.limit("20/minute")
async def image(
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User | None = Depends(get_optional_user),
) -> AnalysisResponse:
    result = await analyze_image(file)
    persist_analysis(db, result, file.filename or "uploaded image", user)
    return result


@router.post("/audio", response_model=AnalysisResponse)
@limiter.limit("20/minute")
async def audio(
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User | None = Depends(get_optional_user),
) -> AnalysisResponse:
    result = await analyze_audio(file)
    persist_analysis(db, result, file.filename or "uploaded audio", user)
    return result


@router.post("/video", response_model=AnalysisResponse)
@limiter.limit("20/minute")
async def video(
    request: Request,
    link: str = Form(default=""),
    context: str = Form(default=""),
    file: UploadFile | None = File(default=None),
    db: Session = Depends(get_db),
    user: User | None = Depends(get_optional_user),
) -> AnalysisResponse:
    result = await analyze_video(link=link, context=context, file=file)
    summary = context or link or (file.filename if file else "uploaded video")
    persist_analysis(db, result, summary, user)
    return result
