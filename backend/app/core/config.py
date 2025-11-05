"""Application configuration"""
from typing import List, Optional
from pydantic import AnyHttpUrl, validator
from pydantic_settings import BaseSettings
import os


class Settings(BaseSettings):
    """Application settings"""
    
    # API
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "GAM Configuration Manager"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = "postgresql://localhost/gam_config_manager"
    
    # Security
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []
    
    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: str | List[str]) -> List[str] | str:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)
    
    # GAM Configuration
    GAM_PATH: str = "/usr/local/bin/gam"
    GAM_CONFIG_DIR: Optional[str] = None
    GAM_DOMAIN: str = ""
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

