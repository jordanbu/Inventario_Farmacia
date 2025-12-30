import { useState, useRef, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
import './ChatAssistant.css';

function ChatAssistant() {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: '¡Hola! Soy tu asistente farmacéutico virtual. Puedo ayudarte a:\n\n• Buscar productos en nuestro inventario\n• Sugerir alternativas si no tenemos lo que buscas\n• Recomendar productos para síntomas específicos\n\n¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState('product'); // 'product' o 'symptom'
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userMessage = {
      type: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const endpoint = searchType === 'product' 
        ? `${API_BASE_URL}/api/asistente/buscar`
        : `${API_BASE_URL}/api/asistente/sintomas`;

      const body = searchType === 'product'
        ? { query: inputText }
        : { symptom: inputText };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Error en la respuesta del servidor');

      const data = await response.json();

      const botMessage = {
        type: 'bot',
        text: data.recommendation || data.advice || 'No pude generar una respuesta.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        type: 'bot',
        text: 'Lo siento, hubo un error al procesar tu consulta. Por favor, intenta de nuevo.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (question, type) => {
    setInputText(question);
    setSearchType(type);
  };

  const clearChat = () => {
    setMessages([
      {
        type: 'bot',
        text: '¡Hola! Soy tu asistente farmacéutico virtual. ¿En qué puedo ayudarte?',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="chat-assistant">
      <div className="chat-header">
        <div className="header-content">
          <div className="header-icon">💊</div>
          <div>
            <h2>Asistente Farmacéutico</h2>
            <p className="status">
              <span className="status-dot"></span>
              En línea
            </p>
          </div>
        </div>
        <button onClick={clearChat} className="clear-btn" title="Limpiar chat">
          🔄
        </button>
      </div>

      <div className="search-type-selector">
        <button
          className={`type-btn ${searchType === 'product' ? 'active' : ''}`}
          onClick={() => setSearchType('product')}
        >
          🔍 Buscar Producto
        </button>
        <button
          className={`type-btn ${searchType === 'symptom' ? 'active' : ''}`}
          onClick={() => setSearchType('symptom')}
        >
          🩺 Consultar Síntoma
        </button>
      </div>

      <div className="quick-questions">
        <p className="quick-title">Preguntas rápidas:</p>
        <div className="quick-buttons">
          <button onClick={() => handleQuickQuestion('¿Tienes paracetamol?', 'product')}>
            Paracetamol
          </button>
          <button onClick={() => handleQuickQuestion('Necesito algo para el dolor de cabeza', 'symptom')}>
            Dolor de cabeza
          </button>
          <button onClick={() => handleQuickQuestion('¿Qué jarabes tienen disponibles?', 'product')}>
            Jarabes
          </button>
          <button onClick={() => handleQuickQuestion('Tengo tos y congestión', 'symptom')}>
            Tos y congestión
          </button>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            <div className="message-avatar">
              {message.type === 'bot' ? '🤖' : '👤'}
            </div>
            <div className="message-content">
              <div className="message-text">{message.text}</div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString('es-ES', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="message bot">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input-form">
        <div className="input-container">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              searchType === 'product' 
                ? 'Busca un producto...' 
                : 'Describe tu síntoma...'
            }
            disabled={loading}
            className="chat-input"
          />
          <button 
            type="submit" 
            disabled={loading || !inputText.trim()}
            className="send-btn"
          >
            {loading ? '⏳' : '➤'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatAssistant;
