from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.api.v1 import analyze, auth, history
from app.core.config import settings
from app.core.limiter import limiter
from app.core.rate_limit import rate_limit_exceeded_handler
from app.db.session import Base, engine


def create_app() -> FastAPI:
    app = FastAPI(
        title="KAJ AI API",
        description="Multimodal misinformation detection platform focused on Indonesian content.",
        version="1.0.0",
    )
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)
    app.add_middleware(SlowAPIMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    Base.metadata.create_all(bind=engine)

    app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
    app.include_router(analyze.router, prefix="/api/v1/analyze", tags=["analysis"])
    app.include_router(history.router, prefix="/api/v1/history", tags=["history"])

    @app.get("/health", tags=["system"])
    def health() -> dict[str, str]:
        return {"status": "ok", "service": "kaj-ai"}

    return app


app = create_app()
