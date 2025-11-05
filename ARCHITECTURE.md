# GAM Configuration Manager - Architecture

## System Overview

The GAM Configuration Manager is a full-stack web application built with a modern three-tier architecture:

1. **Frontend** - React + TypeScript SPA
2. **Backend** - FastAPI Python REST API
3. **Database** - PostgreSQL with JSON support

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│  React 18 + TypeScript + Material-UI + React Query         │
│                    (Port 5173)                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         Backend                             │
│         FastAPI + SQLAlchemy + Pydantic                     │
│                    (Port 8000)                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   GAM        │  │  Security    │  │  Comparison  │     │
│  │  Service     │  │  Service     │  │   Service    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
    ┌──────────────────┐      ┌──────────────────┐
    │   PostgreSQL     │      │       GAM        │
    │   Database       │      │   (External)     │
    │   (Port 5432)    │      └──────────────────┘
    └──────────────────┘
```

## Backend Architecture

### Technology Stack

- **Framework**: FastAPI 0.104+
- **ORM**: SQLAlchemy 2.0 (async)
- **Database Driver**: asyncpg
- **Validation**: Pydantic 2.5+
- **Server**: Uvicorn (ASGI)

### Directory Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── api/                 # API routes
│   │   └── v1/
│   │       ├── api.py       # Router aggregation
│   │       └── endpoints/   # Endpoint modules
│   │           ├── configurations.py
│   │           ├── comparisons.py
│   │           ├── security.py
│   │           ├── templates.py
│   │           └── gam.py
│   ├── core/                # Core config
│   │   └── config.py        # Settings management
│   ├── db/                  # Database layer
│   │   ├── base.py          # DB connection
│   │   ├── models.py        # SQLAlchemy models
│   │   └── init_db.py       # DB initialization
│   ├── schemas/             # Pydantic schemas
│   │   └── config.py        # Request/response models
│   └── services/            # Business logic
│       ├── gam_service.py       # GAM integration
│       ├── comparison_service.py # Config comparison
│       └── security_service.py  # Security analysis
├── requirements.txt
└── .env
```

### Key Components

#### 1. API Layer (`app/api/v1/endpoints/`)

RESTful endpoints organized by resource:
- **configurations.py**: CRUD for configurations
- **comparisons.py**: Config comparison logic
- **security.py**: Security analysis endpoints
- **templates.py**: Template management
- **gam.py**: GAM extraction endpoints

#### 2. Service Layer (`app/services/`)

Business logic separated from API:

**GAM Service** (`gam_service.py`):
- Executes GAM commands asynchronously
- Parses JSON output
- Handles errors and retries
- Supports multiple config types

**Comparison Service** (`comparison_service.py`):
- Deep object comparison algorithm
- Difference detection (added/removed/modified)
- Path tracking for nested structures
- Summary generation

**Security Service** (`security_service.py`):
- Plugin-based security rules
- Severity classification
- Recommendation generation
- Score calculation

#### 3. Database Layer (`app/db/`)

Async SQLAlchemy ORM:
- **models.py**: Database models
  - Configuration
  - ConfigComparison
  - SecurityAnalysis
  - ConfigTemplate
- **base.py**: Async engine and session factory
- **init_db.py**: Database initialization

#### 4. Schema Layer (`app/schemas/`)

Pydantic models for validation:
- Request validation
- Response serialization
- Type safety
- Documentation generation

### Database Schema

```sql
-- Configurations table
CREATE TABLE configurations (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    config_type VARCHAR NOT NULL,
    config_data JSONB NOT NULL,
    is_template BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Config comparisons table
CREATE TABLE config_comparisons (
    id SERIAL PRIMARY KEY,
    source_config_id INTEGER REFERENCES configurations(id),
    target_config_id INTEGER REFERENCES configurations(id),
    differences JSONB NOT NULL,
    drift_detected BOOLEAN DEFAULT FALSE,
    summary TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Security analyses table
CREATE TABLE security_analyses (
    id SERIAL PRIMARY KEY,
    configuration_id INTEGER REFERENCES configurations(id),
    severity VARCHAR NOT NULL,
    category VARCHAR,
    title VARCHAR NOT NULL,
    description TEXT NOT NULL,
    recommendation TEXT NOT NULL,
    affected_settings JSONB,
    remediation_steps JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Config templates table
CREATE TABLE config_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL,
    description TEXT,
    config_type VARCHAR NOT NULL,
    template_data JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## Frontend Architecture

### Technology Stack

- **Framework**: React 18
- **Language**: TypeScript 5.2+
- **Build Tool**: Vite 5
- **UI Framework**: Material-UI (MUI) 5
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router 6
- **HTTP Client**: Axios

### Directory Structure

```
frontend/
├── src/
│   ├── main.tsx            # App entry point
│   ├── App.tsx             # Root component
│   ├── theme.ts            # MUI theme config
│   ├── components/         # Reusable components
│   │   └── Layout.tsx      # App layout
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Configurations.tsx
│   │   ├── ConfigurationDetail.tsx
│   │   ├── Comparisons.tsx
│   │   ├── Security.tsx
│   │   └── Templates.tsx
│   ├── services/           # API clients
│   │   └── api.ts          # Axios instances
│   └── types/              # TypeScript types
│       └── index.ts        # Type definitions
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Key Patterns

#### 1. Component Structure

Pages are organized by feature:
- **Dashboard**: Overview and stats
- **Configurations**: List and manage configs
- **ConfigurationDetail**: View and analyze single config
- **Comparisons**: View comparison results
- **Security**: Security overview
- **Templates**: Manage templates

#### 2. State Management

React Query for server state:
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['configurations'],
  queryFn: () => configurationsApi.list()
})
```

Benefits:
- Automatic caching
- Background refetching
- Optimistic updates
- Loading/error states

#### 3. API Client

Centralized Axios client:
```typescript
const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' }
})
```

Organized by resource:
- configurationsApi
- comparisonsApi
- securityApi
- templatesApi
- gamApi

#### 4. Type Safety

Full TypeScript coverage:
- API response types
- Component props
- State types
- Enum types

## Data Flow

### Configuration Extraction Flow

```
1. User clicks "Extract Configuration"
2. Frontend → POST /api/v1/gam/extract
3. Backend → GAM Service
4. GAM Service → Execute GAM command
5. GAM → Return configuration data
6. GAM Service → Parse JSON
7. Backend → Save to database
8. Backend → Return configuration ID
9. Frontend → Navigate to configuration detail
```

### Configuration Comparison Flow

```
1. User selects two configurations to compare
2. Frontend → POST /api/v1/comparisons/
3. Backend → Fetch both configurations
4. Backend → Comparison Service
5. Comparison Service → Deep compare algorithm
6. Comparison Service → Generate differences
7. Backend → Save comparison result
8. Backend → Return comparison with differences
9. Frontend → Display diff viewer
```

### Security Analysis Flow

```
1. User clicks "Run Security Analysis"
2. Frontend → POST /api/v1/security/analyze/{id}
3. Backend → Fetch configuration
4. Backend → Security Service
5. Security Service → Run all security rules
6. Security Service → Generate findings
7. Backend → Save findings to database
8. Backend → Return findings array
9. Frontend → Display findings with recommendations
```

## Security Considerations

### Backend Security

- **Input Validation**: Pydantic schemas validate all inputs
- **SQL Injection**: SQLAlchemy ORM prevents SQL injection
- **CORS**: Configured CORS origins
- **Environment Variables**: Secrets stored in .env
- **Error Handling**: Proper exception handling

### Frontend Security

- **XSS Prevention**: React escapes output by default
- **Type Safety**: TypeScript prevents type errors
- **API Validation**: Backend validates all requests
- **Environment Variables**: API URLs configurable

### Database Security

- **Parameterized Queries**: ORM prevents injection
- **Connection Pooling**: Efficient connection management
- **Backup Strategy**: Regular backups recommended
- **Access Control**: Database user permissions

## Performance Optimizations

### Backend

- **Async I/O**: FastAPI + async SQLAlchemy
- **Connection Pooling**: Database connection reuse
- **JSON Fields**: Efficient JSONB storage
- **Indexes**: Primary keys and foreign keys indexed

### Frontend

- **Code Splitting**: Vite automatic code splitting
- **Lazy Loading**: React lazy loading for routes
- **Caching**: React Query automatic caching
- **Memoization**: React.memo for expensive components

## Scalability

### Horizontal Scaling

- **Stateless Backend**: Can run multiple instances
- **Database Pooling**: Shared connection pool
- **Load Balancer**: Distribute requests

### Vertical Scaling

- **Database**: Upgrade PostgreSQL resources
- **Backend**: Increase worker processes
- **Caching**: Add Redis for session storage

## Monitoring & Logging

### Recommended Additions

1. **Application Logging**: Structured logging (JSON)
2. **Error Tracking**: Sentry integration
3. **Performance Monitoring**: APM tools
4. **Health Checks**: Liveness/readiness endpoints
5. **Metrics**: Prometheus metrics

## Deployment Architecture

### Development

```
Developer Machine
├── Backend (localhost:8000)
├── Frontend (localhost:5173)
└── PostgreSQL (localhost:5432)
```

### Production (Recommended)

```
Load Balancer
├── Frontend Server(s) (Nginx + Static Files)
└── Backend Server(s) (Uvicorn + Gunicorn)
    └── Database (Managed PostgreSQL)
```

## Future Architecture Enhancements

1. **Microservices**: Split into separate services
2. **Message Queue**: RabbitMQ/Redis for async tasks
3. **Caching Layer**: Redis for frequently accessed data
4. **CDN**: Static asset delivery
5. **Container Orchestration**: Kubernetes deployment
6. **API Gateway**: Centralized API management

