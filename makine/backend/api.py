from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from contextlib import asynccontextmanager
import os
from scanner import load_model, analyze_code

MODEL_PATH = os.path.join(os.path.dirname(__file__), "syntax_sherlock_model.pkl")
ml_models = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        loaded_model = load_model(MODEL_PATH)
        ml_models["scanner"] = loaded_model
        
        if isinstance(loaded_model, dict):
            print("✅ Model loaded successfully (dict format).")
        else:
            print("✅ Model loaded successfully (direct object).")
    except FileNotFoundError:
        print("❌ Model not found! API functionality will be limited.")
    except Exception as e:
        print(f"❌ Model loading error: {e}")
    yield
    ml_models.clear()

app = FastAPI(title="SyntaxSherlock API", version="1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/")
def read_root():
    return {"message": "SyntaxSherlock API is running! Use POST /analyze to scan files."}

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_files(files: List[UploadFile] = File(...)):
    if "scanner" not in ml_models:
        raise HTTPException(status_code=500, detail="Model not loaded on server.")
    
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
                risk_details = []
                for r in analysis:
                    risk_details.append(RiskDetail(**r))
                    
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

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
