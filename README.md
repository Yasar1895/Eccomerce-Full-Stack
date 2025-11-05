# ecommerce-fullstack

Full stack e-commerce demo:
- Frontend: React (Vite) — deploy to Netlify
- Backend: FastAPI (Python, SQLite) — deploy to Railway/Render/Heroku

## Quick local run

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate    # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
