# GAM Configuration Manager

A modern web application for managing Google Workspace configurations using GAM (Google Apps Manager).

## Features

- **Configuration Extraction**: Extract all Google Workspace settings and configurations using GAM
- **Configuration Storage**: Store configurations in a database with version history
- **Template Management**: Create and manage configuration templates
- **Drift Detection**: Compare current configurations against stored templates to detect configuration drift
- **Security Analysis**: Get security recommendations based on your current settings
- **Recommendations**: Receive actionable advice for improving your Google Workspace configuration

## Architecture

- **Backend**: Python FastAPI with async support
- **Frontend**: React 18 with TypeScript and Vite
- **Database**: PostgreSQL with SQLAlchemy ORM
- **UI Framework**: Material-UI (MUI) for modern, responsive design

## Project Structure

```
GAM/
├── backend/           # FastAPI backend application
│   ├── app/
│   │   ├── api/      # API routes
│   │   ├── core/     # Core functionality and config
│   │   ├── db/       # Database models and connection
│   │   ├── services/ # Business logic
│   │   └── schemas/  # Pydantic models
│   ├── requirements.txt
│   └── .env.example
├── frontend/         # React frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── package.json
│   └── .env.example
└── README.md
```

## Prerequisites

- Python 3.9+
- Node.js 18+
- PostgreSQL 14+
- GAM (Google Apps Manager) installed and configured

## Quick Start

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your database credentials
python -m app.main
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

### Database Setup

```bash
# Create PostgreSQL database
createdb gam_config_manager

# Run migrations (auto-created on first run)
cd backend
python -m app.db.init_db
```

## Usage

1. **Extract Configuration**: Click "Extract Configuration" to pull current Google Workspace settings using GAM
2. **Save as Template**: Save extracted configurations as reusable templates
3. **Compare Configs**: Load a template and compare it against the current configuration to detect drift
4. **Security Analysis**: Run security analysis to get recommendations for improving your security posture

## Development

### Backend Development

```bash
cd backend
# Run with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development

```bash
cd frontend
# Run development server
npm run dev
```

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

