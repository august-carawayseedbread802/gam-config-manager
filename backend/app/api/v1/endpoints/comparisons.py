"""Configuration comparison endpoints"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.base import get_db
from app.db.models import Configuration, ConfigComparison
from app.schemas.config import ConfigComparisonCreate, ConfigComparisonResponse
from app.services.comparison_service import ComparisonService

router = APIRouter()


@router.post("/", response_model=ConfigComparisonResponse)
async def create_comparison(
    comparison: ConfigComparisonCreate,
    db: AsyncSession = Depends(get_db)
):
    """Compare two configurations"""
    # Get source configuration
    source_result = await db.execute(
        select(Configuration).where(Configuration.id == comparison.source_config_id)
    )
    source_config = source_result.scalar_one_or_none()
    
    if not source_config:
        raise HTTPException(status_code=404, detail="Source configuration not found")
    
    # Get target configuration
    target_result = await db.execute(
        select(Configuration).where(Configuration.id == comparison.target_config_id)
    )
    target_config = target_result.scalar_one_or_none()
    
    if not target_config:
        raise HTTPException(status_code=404, detail="Target configuration not found")
    
    # Perform comparison
    comparison_service = ComparisonService()
    differences, drift_detected = comparison_service.compare_configs(
        source_config.config_data,
        target_config.config_data
    )
    
    summary = comparison_service.generate_summary(differences)
    
    # Save comparison
    db_comparison = ConfigComparison(
        source_config_id=comparison.source_config_id,
        target_config_id=comparison.target_config_id,
        differences={"items": differences},
        drift_detected=drift_detected,
        summary=summary
    )
    
    db.add(db_comparison)
    await db.commit()
    await db.refresh(db_comparison)
    
    return db_comparison


@router.get("/", response_model=List[ConfigComparisonResponse])
async def list_comparisons(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """List all comparisons"""
    query = select(ConfigComparison).offset(skip).limit(limit).order_by(
        ConfigComparison.created_at.desc()
    )
    
    result = await db.execute(query)
    comparisons = result.scalars().all()
    return comparisons


@router.get("/{comparison_id}", response_model=ConfigComparisonResponse)
async def get_comparison(
    comparison_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific comparison"""
    result = await db.execute(
        select(ConfigComparison).where(ConfigComparison.id == comparison_id)
    )
    comparison = result.scalar_one_or_none()
    
    if not comparison:
        raise HTTPException(status_code=404, detail="Comparison not found")
    
    return comparison

