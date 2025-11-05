# API Documentation

## Base URL

```
http://localhost:8000/api/v1
```

## Authentication

Currently, the API does not require authentication. In production, you should implement proper authentication (JWT, OAuth2, etc.).

## Endpoints

### Health Check

#### GET /health

Check if the API is running.

**Response:**
```json
{
  "status": "healthy"
}
```

---

## Configurations

### List Configurations

#### GET /api/v1/configurations/

Get a list of all configurations.

**Query Parameters:**
- `skip` (integer): Number of records to skip (default: 0)
- `limit` (integer): Maximum number of records to return (default: 100)
- `is_template` (boolean): Filter by template status

**Response:**
```json
[
  {
    "id": 1,
    "name": "Production Users Config",
    "description": "User configurations from production",
    "config_type": "user",
    "config_data": {...},
    "is_template": false,
    "created_at": "2024-01-15T10:30:00",
    "updated_at": "2024-01-15T10:30:00"
  }
]
```

### Get Configuration

#### GET /api/v1/configurations/{config_id}

Get a specific configuration by ID.

**Response:**
```json
{
  "id": 1,
  "name": "Production Users Config",
  "description": "User configurations from production",
  "config_type": "user",
  "config_data": {...},
  "is_template": false,
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

### Create Configuration

#### POST /api/v1/configurations/

Create a new configuration.

**Request Body:**
```json
{
  "name": "New Configuration",
  "description": "Description of the configuration",
  "config_type": "user",
  "config_data": {...},
  "is_template": false
}
```

**Response:** Same as Get Configuration

### Update Configuration

#### PUT /api/v1/configurations/{config_id}

Update an existing configuration.

**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

**Response:** Updated configuration object

### Delete Configuration

#### DELETE /api/v1/configurations/{config_id}

Delete a configuration.

**Response:**
```json
{
  "message": "Configuration deleted successfully"
}
```

---

## Comparisons

### List Comparisons

#### GET /api/v1/comparisons/

Get a list of all configuration comparisons.

**Query Parameters:**
- `skip` (integer): Number of records to skip
- `limit` (integer): Maximum number of records to return

**Response:**
```json
[
  {
    "id": 1,
    "source_config_id": 1,
    "target_config_id": 2,
    "differences": {
      "items": [...]
    },
    "drift_detected": true,
    "summary": "Configuration drift detected: 5 setting(s) modified",
    "created_at": "2024-01-15T10:30:00"
  }
]
```

### Get Comparison

#### GET /api/v1/comparisons/{comparison_id}

Get a specific comparison by ID.

**Response:** Same as List Comparisons (single item)

### Create Comparison

#### POST /api/v1/comparisons/

Compare two configurations.

**Request Body:**
```json
{
  "source_config_id": 1,
  "target_config_id": 2
}
```

**Response:**
```json
{
  "id": 1,
  "source_config_id": 1,
  "target_config_id": 2,
  "differences": {
    "items": [
      {
        "path": "users.0.isEnforcedIn2Sv",
        "type": "modified",
        "source_value": true,
        "target_value": false,
        "severity": "high"
      }
    ]
  },
  "drift_detected": true,
  "summary": "Configuration drift detected: 1 setting(s) modified",
  "created_at": "2024-01-15T10:30:00"
}
```

---

## Security Analysis

### Analyze Configuration

#### POST /api/v1/security/analyze/{config_id}

Run security analysis on a configuration.

**Response:**
```json
[
  {
    "id": 1,
    "configuration_id": 1,
    "severity": "high",
    "category": "Authentication",
    "title": "Two-Factor Authentication Not Enforced",
    "description": "User john@example.com does not have 2FA enforced",
    "recommendation": "Enable 2FA enforcement for all users",
    "affected_settings": {
      "user": "john@example.com"
    },
    "remediation_steps": [
      "Go to Admin Console > Security > 2-Step Verification",
      "Select 'Enforce 2-Step Verification'",
      "Set appropriate enforcement date"
    ],
    "created_at": "2024-01-15T10:30:00"
  }
]
```

### Get Security Analyses

#### GET /api/v1/security/analyses/{config_id}

Get all security analyses for a configuration.

**Response:** Array of security analysis objects

### Get Security Score

#### GET /api/v1/security/score/{config_id}

Get security score for a configuration.

**Response:**
```json
{
  "configuration_id": 1,
  "security_score": 75,
  "total_findings": 5,
  "critical_findings": 0,
  "high_findings": 2,
  "medium_findings": 2,
  "low_findings": 1
}
```

---

## Templates

### List Templates

#### GET /api/v1/templates/

Get a list of all configuration templates.

**Query Parameters:**
- `skip` (integer): Number of records to skip
- `limit` (integer): Maximum number of records to return
- `is_active` (boolean): Filter by active status

**Response:**
```json
[
  {
    "id": 1,
    "name": "Security Baseline",
    "description": "Recommended security settings",
    "config_type": "security",
    "template_data": {...},
    "is_active": true,
    "created_at": "2024-01-15T10:30:00",
    "updated_at": "2024-01-15T10:30:00"
  }
]
```

### Get Template

#### GET /api/v1/templates/{template_id}

Get a specific template by ID.

**Response:** Same as List Templates (single item)

### Create Template

#### POST /api/v1/templates/

Create a new template.

**Request Body:**
```json
{
  "name": "Security Baseline",
  "description": "Recommended security settings",
  "config_type": "security",
  "template_data": {...},
  "is_active": true
}
```

**Response:** Created template object

### Delete Template

#### DELETE /api/v1/templates/{template_id}

Delete a template.

**Response:**
```json
{
  "message": "Template deleted successfully"
}
```

---

## GAM Integration

### Extract Configuration

#### POST /api/v1/gam/extract

Extract configuration from GAM.

**Request Body:**
```json
{
  "config_types": ["user", "group", "organizational_unit"],
  "save_as_template": false,
  "template_name": "Optional Template Name"
}
```

**Configuration Types:**
- `user` - User settings
- `group` - Group settings
- `organizational_unit` - OU settings
- `domain` - Domain settings
- `calendar` - Calendar resources
- `drive` - Drive settings
- `gmail` - Gmail settings
- `security` - Security settings

**Response:**
```json
{
  "success": true,
  "message": "Configuration extracted successfully",
  "configuration_id": 1,
  "extracted_types": ["user", "group"],
  "total_items": 150
}
```

### Test GAM Connection

#### GET /api/v1/gam/test-connection

Test connection to GAM.

**Response:**
```json
{
  "status": "connected",
  "message": "GAM is properly configured",
  "version": "6.70.00"
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "detail": "Error message describing what went wrong"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error message"
}
```

---

## Data Types

### ConfigType Enum
- `user`
- `group`
- `organizational_unit`
- `domain`
- `calendar`
- `drive`
- `gmail`
- `security`
- `other`

### SeverityLevel Enum
- `critical`
- `high`
- `medium`
- `low`
- `info`

### Difference Type Enum
- `added` - Setting was added
- `removed` - Setting was removed
- `modified` - Setting was changed

---

## Interactive API Documentation

For interactive API documentation with the ability to test endpoints:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

These provide:
- Complete endpoint documentation
- Request/response schemas
- Try-it-out functionality
- Schema definitions
- Example requests and responses

