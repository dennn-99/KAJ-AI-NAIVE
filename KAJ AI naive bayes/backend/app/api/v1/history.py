from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.models import Analysis, User
from app.db.session import get_db
from app.schemas.analysis import AnalysisHistoryItem


router = APIRouter()


@router.get("", response_model=list[AnalysisHistoryItem])
def history(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> list[AnalysisHistoryItem]:
    items = (
        db.query(Analysis)
        .filter(Analysis.user_id == user.id)
        .order_by(Analysis.created_at.desc())
        .limit(50)
        .all()
    )
    return [
        AnalysisHistoryItem(
            id=item.id,
            modality=item.modality,
            input_summary=item.input_summary,
            label=item.label,
            credibility_score=item.credibility_score,
            misinformation_risk_score=item.misinformation_risk_score,
            ai_generated_probability=item.ai_generated_probability,
            confidence_score=item.confidence_score / 100,
            explanation=item.explanation,
            created_at=item.created_at,
        )
        for item in items
    ]
