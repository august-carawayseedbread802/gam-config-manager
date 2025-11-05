"""Configuration endpoints"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.base import get_db
from app.db.models import Configuration
from app.schemas.config import (
    ConfigurationCreate,
    ConfigurationUpdate,
    ConfigurationResponse
)

router = APIRouter()


@router.post("/", response_model=ConfigurationResponse)
async def create_configuration(
    config: ConfigurationCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new configuration"""
    db_config = Configuration(**config.model_dump())
    db.add(db_config)
    await db.commit()
    await db.refresh(db_config)
    return db_config


@router.get("/", response_model=List[ConfigurationResponse])
async def list_configurations(
    skip: int = 0,
    limit: int = 100,
    is_template: bool = None,
    db: AsyncSession = Depends(get_db)
):
    """List all configurations"""
    query = select(Configuration)
    
    if is_template is not None:
        query = query.where(Configuration.is_template == is_template)
    
    query = query.offset(skip).limit(limit).order_by(Configuration.created_at.desc())
    
    result = await db.execute(query)
    configs = result.scalars().all()
    return configs


@router.get("/{config_id}", response_model=ConfigurationResponse)
async def get_configuration(
    config_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific configuration"""
    result = await db.execute(
        select(Configuration).where(Configuration.id == config_id)
    )
    config = result.scalar_one_or_none()
    
    if not config:
        raise HTTPException(status_code=404, detail="Configuration not found")
    
    return config


@router.put("/{config_id}", response_model=ConfigurationResponse)
async def update_configuration(
    config_id: int,
    config_update: ConfigurationUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a configuration"""
    result = await db.execute(
        select(Configuration).where(Configuration.id == config_id)
    )
    config = result.scalar_one_or_none()
    
    if not config:
        raise HTTPException(status_code=404, detail="Configuration not found")
    
    # Update fields
    update_data = config_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(config, field, value)
    
    await db.commit()
    await db.refresh(config)
    return config


@router.delete("/{config_id}")
async def delete_configuration(
    config_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete a configuration"""
    result = await db.execute(
        select(Configuration).where(Configuration.id == config_id)
    )
    config = result.scalar_one_or_none()
    
    if not config:
        raise HTTPException(status_code=404, detail="Configuration not found")
    
    await db.delete(config)
    await db.commit()
    
    return {"message": "Configuration deleted successfully"}

