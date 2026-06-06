from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = Field("sqlite:///./kaj_ai.db", alias="DATABASE_URL")
    jwt_secret_key: str = Field("dev-secret-change-me", alias="JWT_SECRET_KEY")
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    cors_origins_raw: str = Field("http://localhost:3000", alias="CORS_ORIGINS")
    rate_limit_default: str = "60/minute"

    model_config = SettingsConfigDict(env_file=".env", populate_by_name=True)

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins_raw.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
