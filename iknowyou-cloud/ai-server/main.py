from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from pydantic import BaseModel
import uvicorn
import os
from dotenv import load_dotenv
import pinecone
from typing import List, Optional
import json

# 환경 변수 로드
load_dotenv()

app = FastAPI(
    title="iknowyou AI Server",
    description="AI 서비스 API 서버",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://iknowyou.cloud",
        "https://www.iknowyou.cloud",
        "https://admin.iknowyou.cloud",
        "https://pibuchi.duckdns.org"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# PineCone 초기화
try:
    pinecone.init(
        api_key=os.getenv("PINECONE_API_KEY"),
        environment=os.getenv("PINECONE_ENVIRONMENT")
    )
    index_name = os.getenv("PINECONE_INDEX_NAME", "iknowyou-vectors")
    
    # 인덱스가 없으면 생성
    if index_name not in pinecone.list_indexes():
        pinecone.create_index(
            name=index_name,
            dimension=1536,  # OpenAI embedding dimension
            metric="cosine"
        )
    
    vector_index = pinecone.Index(index_name)
except Exception as e:
    print(f"PineCone 초기화 실패: {e}")
    vector_index = None

# 데이터 모델
class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = None
    context: Optional[List[str]] = []

class ChatResponse(BaseModel):
    response: str
    confidence: float
    sources: List[str] = []

class VectorSearchRequest(BaseModel):
    query: str
    top_k: int = 5

class VectorSearchResponse(BaseModel):
    results: List[dict]
    total: int

# 인증
security = HTTPBearer()

def verify_token(token: str = Depends(security)):
    # JWT 토큰 검증 로직 (실제 구현 필요)
    return token.credentials

@app.get("/")
async def root():
    return {
        "message": "iknowyou AI Server",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "pinecone_connected": vector_index is not None
    }

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    AI 채팅 API
    """
    try:
        # 간단한 응답 로직 (실제로는 OpenAI API 사용)
        response = f"안녕하세요! '{request.message}'에 대한 답변입니다."
        
        return ChatResponse(
            response=response,
            confidence=0.85,
            sources=["iknowyou_knowledge_base"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/search", response_model=VectorSearchResponse)
async def vector_search(request: VectorSearchRequest):
    """
    벡터 검색 API
    """
    if not vector_index:
        raise HTTPException(status_code=500, detail="PineCone 연결 실패")
    
    try:
        # 실제 벡터 검색 로직 구현 필요
        # 임시 응답
        results = [
            {
                "id": "doc_1",
                "score": 0.95,
                "content": "검색된 문서 내용"
            }
        ]
        
        return VectorSearchResponse(
            results=results,
            total=len(results)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/embed")
async def create_embedding(text: str):
    """
    텍스트 임베딩 생성 API
    """
    try:
        # OpenAI 임베딩 API 사용 (실제 구현 필요)
        # 임시 응답
        embedding = [0.1] * 1536  # 1536차원 벡터
        
        return {
            "embedding": embedding,
            "dimension": len(embedding)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8081,
        reload=True
    ) 
