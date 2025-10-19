from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import pickle
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import os
from dotenv import load_dotenv
import openai

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Furniture Recommendation API")

# Add CORS middleware to allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models and data at startup
print("Loading models...")
try:
    # Load sentence transformer model
    sentence_model = SentenceTransformer('all-MiniLM-L6-v2')
    
    # Load embeddings
    embeddings = np.load('models/sentence_embeddings.npy')
    
    # Load product data
    with open('models/product_data.pkl', 'rb') as f:
        products = pickle.load(f)
    
    print(f"Loaded {len(products)} products successfully!")
    
except Exception as e:
    print(f"Error loading models: {e}")
    products = []
    embeddings = None

# Set up OpenAI for GenAI descriptions
openai.api_key = os.getenv("OPENAI_API_KEY")

# Pydantic models for request/response
class RecommendationRequest(BaseModel):
    query: str
    num_recommendations: int = 5

class Product(BaseModel):
    uniq_id: str
    title: str
    brand: str
    description: str
    price: float
    categories: str
    images: str
    material: Optional[str] = None
    color: Optional[str] = None
    ai_description: Optional[str] = None
    similarity_score: Optional[float] = None

class RecommendationResponse(BaseModel):
    query: str
    recommendations: List[Product]
    message: str

@app.get("/")
def read_root():
    """Health check endpoint"""
    return {
        "status": "online",
        "message": "Furniture Recommendation API is running",
        "total_products": len(products)
    }

@app.post("/api/recommend", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    """
    Get product recommendations based on user query.
    Uses semantic search with sentence embeddings.
    """
    try:
        if not products or embeddings is None:
            raise HTTPException(status_code=500, detail="Models not loaded properly")
        
        # Create embedding for user query
        query_embedding = sentence_model.encode([request.query])[0]
        
        # Calculate similarity with all products
        similarities = cosine_similarity([query_embedding], embeddings).flatten()
        
        # Get top N recommendations
        top_indices = similarities.argsort()[-request.num_recommendations:][::-1]
        
        # Prepare recommended products
        recommendations = []
        for idx in top_indices:
            product = products[idx].copy()
            product['similarity_score'] = float(similarities[idx])
            
            # Generate AI description
            ai_desc = generate_ai_description(product)
            product['ai_description'] = ai_desc
            
            recommendations.append(Product(**product))
        
        return RecommendationResponse(
            query=request.query,
            recommendations=recommendations,
            message=f"Found {len(recommendations)} recommendations for '{request.query}'"
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def generate_ai_description(product: dict) -> str:
    """
    Generate creative product description using OpenAI.
    Falls back to original description if API fails.
    """
    try:
        # Check if API key is set
        if not openai.api_key or openai.api_key == "your_openai_api_key_here":
            # Return enhanced description without API
            return f"✨ {product['title']} - A beautiful {product.get('material', '')} piece in {product.get('color', '')}. {product['description'][:100]}..."
        
        # Generate with OpenAI
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a creative furniture product copywriter. Write engaging, concise product descriptions."},
                {"role": "user", "content": f"Write a creative 2-sentence description for: {product['title']}. Category: {product['categories']}. Material: {product.get('material', 'N/A')}. Color: {product.get('color', 'N/A')}."}
            ],
            max_tokens=100,
            temperature=0.7
        )
        
        return response.choices[0].message.content.strip()
    
    except Exception as e:
        print(f"AI generation error: {e}")
        # Fallback to enhanced description
        return f"✨ {product['title']} - {product['description'][:150]}..."

@app.get("/api/products")
def get_all_products():
    """Get all products for analytics"""
    return {
        "total": len(products),
        "products": products
    }

@app.get("/api/analytics")
def get_analytics():
    """Get analytics data about the product catalog"""
    try:
        import pandas as pd
        df = pd.DataFrame(products)
        
        # Calculate analytics
        analytics = {
            "total_products": len(products),
            "categories": df['categories'].value_counts().head(10).to_dict(),
            "brands": df['brand'].value_counts().head(10).to_dict(),
            "price_stats": {
                "min": float(df['price'].min()),
                "max": float(df['price'].max()),
                "mean": float(df['price'].mean()),
                "median": float(df['price'].median())
            },
            "materials": df['material'].value_counts().head(10).to_dict() if 'material' in df.columns else {},
            "colors": df['color'].value_counts().head(10).to_dict() if 'color' in df.columns else {}
        }
        
        return analytics
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)