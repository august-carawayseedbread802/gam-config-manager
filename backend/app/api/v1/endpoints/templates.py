"""Configuration template endpoints"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.base import get_db
from app.db.models import ConfigTemplate
from app.schemas.config import ConfigTemplateCreate, ConfigTemplateResponse

router = APIRouter()


@router.post("/", response_model=ConfigTemplateResponse)
async def create_template(
    template: ConfigTemplateCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new configuration template"""
    # Check if template with same name exists
    result = await db.execute(
        select(ConfigTemplate).where(ConfigTemplate.name == template.name)
    )
    existing = result.scalar_one_or_none()
    
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Template with this name already exists"
        )
    
    db_template = ConfigTemplate(**template.model_dump())
    db.add(db_template)
    await db.commit()
    await db.refresh(db_template)
    return db_template


@router.get("/", response_model=List[ConfigTemplateResponse])
async def list_templates(
    skip: int = 0,
    limit: int = 100,
    is_active: bool = None,
    db: AsyncSession = Depends(get_db)
):
    """List all templates"""
    query = select(ConfigTemplate)
    
    if is_active is not None:
        query = query.where(ConfigTemplate.is_active == is_active)
    
    query = query.offset(skip).limit(limit).order_by(ConfigTemplate.created_at.desc())
    
    result = await db.execute(query)
    templates = result.scalars().all()
    return templates


@router.get("/{template_id}", response_model=ConfigTemplateResponse)
async def get_template(
    template_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific template"""
    result = await db.execute(
        select(ConfigTemplate).where(ConfigTemplate.id == template_id)
    )
    template = result.scalar_one_or_none()
    
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    return template


@router.delete("/{template_id}")
async def delete_template(
    template_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete a template"""
    result = await db.execute(
        select(ConfigTemplate).where(ConfigTemplate.id == template_id)
    )
    template = result.scalar_one_or_none()
    
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    await db.delete(template)
    await db.commit()
    
    return {"message": "Template deleted successfully"}

