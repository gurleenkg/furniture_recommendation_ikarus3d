# furniture_recommendation_ikarus3d
<img width="1624" height="965" alt="image" src="https://github.com/user-attachments/assets/1818f126-40d4-4e45-ad4e-db0cca1bd9e7" />
# 🪑 AI Furniture Recommendation System

An intelligent furniture recommendation web application using AI, vector embeddings, and semantic search.

## 🌟 Features

- **AI-Powered Recommendations**: Semantic search using sentence transformers
- **Conversational Interface**: Chat-like UI for natural product discovery
- **Creative Descriptions**: AI-generated product descriptions using OpenAI
- **Analytics Dashboard**: Comprehensive data visualization
- **Real-time Search**: Fast vector-based similarity matching

## 🛠️ Tech Stack

- **Backend**: FastAPI, Python
- **Frontend**: React, Vite, Recharts
- **ML**: Sentence Transformers, scikit-learn
- **GenAI**: OpenAI GPT-3.5
- **Vector DB**: Pinecone (optional)

## 📦 Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- pip and npm

### Backend Setup
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
# Edit .env file with your API keys
```

### Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install
```

### Run Jupyter Notebooks
```bash
# Install Jupyter
pip install jupyter

# Run data analysis
cd notebooks
jupyter notebook 01_data_analysis.ipynb

# Run model training
jupyter notebook 02_model_training.ipynb
```

## 🚀 Running the Application

### Start Backend
```bash
cd backend
python main.py
# Backend runs on http://localhost:8000
```

### Start Frontend
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

## 📊 Project Structure
```
furniture-recommender/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # Environment variables
│   └── models/                 # Trained models
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main app component
│   │   ├── pages/
│   │   │   ├── RecommendationPage.jsx
│   │   │   └── AnalyticsPage.jsx
│   │   └── App.css
│   └── package.json
├── notebooks/
│   ├── 01_data_analysis.ipynb  # Data exploration
│   └── 02_model_training.ipynb # Model training
├── data/
│   └── furniture_data.csv      # Dataset
└── README.md
```

## 🎯 How It Works

1. **Data Processing**: Clean and prepare furniture dataset
2. **Embedding Generation**: Create vector embeddings using SentenceTransformers
3. **Semantic Search**: Match user queries with products using cosine similarity
4. **AI Descriptions**: Generate creative descriptions with OpenAI
5. **Analytics**: Visualize product distribution and statistics

## 🔑 API Endpoints

- `GET /` - Health check
- `POST /api/recommend` - Get product recommendations
- `GET /api/products` - Get all products
- `GET /api/analytics` - Get analytics data

## 📝 Notes

- OpenAI API key is optional - system works without it
- Pinecone can be added for production-scale vector storage
- Dataset should be placed in `data/furniture_data.csv`

## 🤝 Contributing

Feel free to fork and improve this project!
