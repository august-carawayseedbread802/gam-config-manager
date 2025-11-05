# GAM Configuration Manager - Setup Guide

This guide will walk you through setting up the GAM Configuration Manager application.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.9 or higher**
  ```bash
  python --version
  ```

- **Node.js 18 or higher**
  ```bash
  node --version
  ```

- **PostgreSQL 14 or higher**
  ```bash
  psql --version
  ```

- **GAM (Google Apps Manager)**
  - Follow the [official GAM installation guide](https://github.com/GAM-team/GAM)
  - Ensure GAM is configured with proper OAuth credentials

## Step 1: Database Setup

1. Create a PostgreSQL database:
   ```bash
   createdb gam_config_manager
   ```

2. (Optional) Create a dedicated PostgreSQL user:
   ```bash
   psql -c "CREATE USER gamuser WITH PASSWORD 'your_password';"
   psql -c "GRANT ALL PRIVILEGES ON DATABASE gam_config_manager TO gamuser;"
   ```

## Step 2: Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a Python virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
   - Windows:
     ```bash
     venv\Scripts\activate
     ```

4. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Create environment configuration:
   ```bash
   cp .env.example .env
   ```

6. Edit `.env` file with your settings:
   ```env
   # Database
   DATABASE_URL=postgresql://username:password@localhost:5432/gam_config_manager
   
   # API
   PROJECT_NAME=GAM Configuration Manager
   DEBUG=True
   
   # Security (change in production!)
   SECRET_KEY=your-super-secret-key-change-this-in-production
   
   # CORS
   BACKEND_CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]
   
   # GAM Configuration
   GAM_PATH=/usr/local/bin/gam
   GAM_CONFIG_DIR=/Users/yourusername/GAMConfig
   GAM_DOMAIN=yourdomain.com
   ```

7. Initialize the database:
   ```bash
   python -m app.db.init_db
   ```

8. Test the backend:
   ```bash
   python -m app.main
   ```
   
   The API should now be running at `http://localhost:8000`
   Visit `http://localhost:8000/docs` to see the API documentation

## Step 3: Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Create environment configuration:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` file:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```
   
   The frontend should now be running at `http://localhost:5173`

## Step 4: Verify GAM Integration

1. In your browser, navigate to `http://localhost:5173`

2. Click on "Extract Configuration" from the dashboard

3. Select the configuration types you want to extract

4. Click "Extract"

If everything is configured correctly, GAM will extract the configurations and store them in the database.

## Troubleshooting

### GAM Connection Issues

If you're having trouble connecting to GAM:

1. Verify GAM is installed:
   ```bash
   gam version
   ```

2. Test GAM authentication:
   ```bash
   gam info domain
   ```

3. Check the GAM_PATH in your `.env` file points to the correct GAM executable:
   ```bash
   which gam
   ```

### Database Connection Issues

If you can't connect to the database:

1. Verify PostgreSQL is running:
   ```bash
   pg_isready
   ```

2. Check your DATABASE_URL in `.env` is correct

3. Ensure the database exists:
   ```bash
   psql -l | grep gam_config_manager
   ```

### Backend Issues

If the backend fails to start:

1. Check Python version:
   ```bash
   python --version  # Should be 3.9+
   ```

2. Verify all dependencies are installed:
   ```bash
   pip list
   ```

3. Check for port conflicts (port 8000):
   ```bash
   lsof -i :8000
   ```

### Frontend Issues

If the frontend fails to start:

1. Check Node.js version:
   ```bash
   node --version  # Should be 18+
   ```

2. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Check for port conflicts (port 5173):
   ```bash
   lsof -i :5173
   ```

## Production Deployment

For production deployment:

1. **Backend**:
   - Set `DEBUG=False` in `.env`
   - Use a strong `SECRET_KEY`
   - Use a production-grade database (managed PostgreSQL)
   - Set up proper CORS origins
   - Use a production ASGI server (Uvicorn with Gunicorn)
   - Set up HTTPS/SSL

2. **Frontend**:
   - Build the production bundle:
     ```bash
     npm run build
     ```
   - Serve the `dist` folder with a web server (Nginx, Apache, etc.)
   - Update `VITE_API_URL` to point to your production API

3. **Database**:
   - Use connection pooling
   - Set up regular backups
   - Configure proper access controls

4. **Security**:
   - Enable database SSL
   - Use environment-specific secrets
   - Implement rate limiting
   - Set up monitoring and logging

## Next Steps

Once everything is running:

1. Extract your first configuration from GAM
2. Run security analysis on the configuration
3. Create configuration templates
4. Set up scheduled extractions to monitor drift
5. Review security recommendations regularly

## Support

For issues or questions:
- Check the main README.md
- Review the API documentation at `/docs`
- Check GAM documentation: https://github.com/GAM-team/GAM

