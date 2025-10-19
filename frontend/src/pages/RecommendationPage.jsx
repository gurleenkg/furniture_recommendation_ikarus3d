import { useState } from 'react';
import { Send, Loader } from 'lucide-react';
import axios from 'axios';
import './RecommendationPage.css';

const API_URL = 'http://localhost:8000';

function RecommendationPage() {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "👋 Hi! I'm your furniture AI assistant. Tell me what you're looking for, and I'll recommend the perfect pieces for you!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      type: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Call recommendation API
      const response = await axios.post(`${API_URL}/api/recommend`, {
        query: input,
        num_recommendations: 5
      });

      const botMessage = {
        type: 'bot',
        text: response.data.message,
        products: response.data.recommendations,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        type: 'bot',
        text: "Sorry, I couldn't process your request. Please make sure the backend server is running!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="recommendation-page">
      <div className="chat-container">
        <div className="messages-area">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.type}`}>
              <div className="message-content">
                <p className="message-text">{msg.text}</p>
                
                {msg.products && (
                  <div className="products-grid">
                    {msg.products.map((product, pidx) => (
                      <div key={pidx} className="product-card">
                        <div className="product-image">
                          <img 
                            src={product.images || '/placeholder-furniture.png'} 
                            alt={product.title}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/200x200?text=Furniture';
                            }}
                          />
                        </div>
                        <div className="product-info">
                          <h3 className="product-title">{product.title}</h3>
                          <p className="product-brand">{product.brand}</p>
                          <p className="product-price">${product.price.toFixed(2)}</p>
                          <p className="product-category">{product.categories}</p>
                          <div className="product-ai-desc">
                            <strong>✨ AI Description:</strong>
                            <p>{product.ai_description}</p>
                          </div>
                          <div className="product-similarity">
                            Match: {(product.similarity_score * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="message bot">
              <div className="message-content">
                <Loader className="spinner" size={20} />
                <span>Finding perfect furniture for you...</span>
              </div>
            </div>
          )}
        </div>

        <div className="input-area">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe the furniture you're looking for..."
            rows="2"
            disabled={loading}
          />
          <button onClick={sendMessage} disabled={loading || !input.trim()}>
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecommendationPage;