"""
SyntaxSherlock Standalone Application
Backend + Frontend birleşik çalıştırıcı
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from contextlib import asynccontextmanager
import os
import sys
import webbrowser
import threading
import time

# PyInstaller için base path
if getattr(sys, 'frozen', False):
    # Exe içindeki dosyalar için
    BASE_DIR = sys._MEIPASS
else:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Model ve static dosya yolları (hepsi exe içinde gömülü)
MODEL_PATH = os.path.join(BASE_DIR, "syntax_sherlock_model.pkl")
STATIC_DIR = os.path.join(BASE_DIR, "static")

# Scanner modülünü import et
sys.path.insert(0, BASE_DIR)
from scanner import load_model, analyze_code

ml_models = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        loaded_model = load_model(MODEL_PATH)
        ml_models["scanner"] = loaded_model
        print("✅ Model loaded successfully.")
    except FileNotFoundError:
        print(f"❌ Model not found at: {MODEL_PATH}")
        print("   Model should be embedded in the exe. Please rebuild.")
    except Exception as e:
        print(f"❌ Model loading error: {e}")
    yield
    ml_models.clear()

VERSION = "1.0.0"

app = FastAPI(title="SyntaxSherlock", version=VERSION, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic modeller
class RiskDetail(BaseModel):
    lineno: int
    code: str
    type: str
    risk_score: float
    message: str
    definite_error: bool

class FileAnalysisResult(BaseModel):
    filename: str
    status: str
    risks: List[RiskDetail] = []
    error: Optional[str] = None

class AnalysisResponse(BaseModel):
    results: List[FileAnalysisResult]

# API Endpoints
@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_files(files: List[UploadFile] = File(...)):
    if "scanner" not in ml_models:
        raise HTTPException(status_code=500, detail="Model not loaded. Please check if model file exists.")
    
    results = []
    
    for file in files:
        content = await file.read()
        try:
            source_code = content.decode("utf-8")
            analysis = analyze_code(source_code, ml_models["scanner"])
            
            if analysis and "error" in analysis[0]:
                results.append(FileAnalysisResult(
                    filename=file.filename,
                    status="error",
                    error=f"Syntax Error at line {analysis[0]['lineno']}: {analysis[0]['error']}"
                ))
            else:
                risk_details = [RiskDetail(**r) for r in analysis]
                results.append(FileAnalysisResult(
                    filename=file.filename,
                    status="success",
                    risks=risk_details
                ))
                
        except UnicodeDecodeError:
            results.append(FileAnalysisResult(
                filename=file.filename,
                status="error",
                error="File must be UTF-8 encoded text."
            ))
        except Exception as e:
            results.append(FileAnalysisResult(
                filename=file.filename,
                status="error",
                error=str(e)
            ))
            
    return AnalysisResponse(results=results)

# Static dosyalar için mount
if os.path.exists(STATIC_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(STATIC_DIR, "assets")), name="assets")
    
    @app.get("/")
    async def serve_index():
        return FileResponse(os.path.join(STATIC_DIR, "index.html"))
    
    @app.get("/{path:path}")
    async def serve_static(path: str):
        file_path = os.path.join(STATIC_DIR, path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(STATIC_DIR, "index.html"))
else:
    @app.get("/")
    def no_frontend():
        return {"message": "SyntaxSherlock API running. Frontend not found in 'static' folder."}

def open_browser():
    """Tarayıcıyı otomatik aç"""
    time.sleep(1.5)
    webbrowser.open("http://localhost:8000")

if __name__ == "__main__":
    print("=" * 50)
    print("🔍 SyntaxSherlock v" + VERSION)
    print("=" * 50)
    print(f"🌐 Opening http://localhost:8000")
    print("=" * 50)
    print("Press Ctrl+C to stop the server")
    print("=" * 50)
    
    # Tarayıcıyı arka planda aç
    threading.Thread(target=open_browser, daemon=True).start()
    
    # Sunucuyu başlat
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="warning")

