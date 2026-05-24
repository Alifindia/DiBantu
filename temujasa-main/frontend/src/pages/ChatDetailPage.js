import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Phone, Paperclip } from 'lucide-react';
import { getConversation, getMessages, sendMessage } from '../api/api';

const ChatDetailPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadData();
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadData = async () => {
    try {
      const [conv, msgs] = await Promise.all([
        getConversation(conversationId),
        getMessages(conversationId)
      ]);
      setConversation(conv);
      setMessages(msgs);
    } catch (e) { console.error(e); }
  };

  const handleSend = async () => {
    const messageText = text.trim();
    if (!messageText || sending) return;
    try {
      setSending(true);
      setText('');
      // Optimistic update - add user message immediately to UI
      const tempMsg = {
        id: `temp-${Date.now()}`,
        conversation_id: conversationId,
        sender: 'user',
        text: messageText,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, tempMsg]);
      
      // Send to backend
      await sendMessage(conversationId, messageText, 'user');
      
      // Reload to get accurate state + auto-reply
      const msgs = await getMessages(conversationId);
      setMessages(msgs);
      
      // Poll once more after a delay in case auto-reply was slightly delayed
      setTimeout(async () => {
        try {
          const updated = await getMessages(conversationId);
          setMessages(updated);
        } catch {}
      }, 1200);
    } catch (e) {
      console.error('Send message failed:', e);
      // Revert optimistic update on failure
      setMessages(prev => prev.filter(m => !m.id.startsWith('temp-')));
      setText(messageText);
      alert('Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (s) => new Date(s).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  if (!conversation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 lg:px-8 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded-full" data-testid="back-button">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <img src={conversation.technician_photo} alt={conversation.technician_name} className="w-10 h-10 rounded-full object-cover" />
          <div className="flex-1">
            <h2 className="font-bold text-gray-900 text-sm lg:text-base">{conversation.technician_name}</h2>
            <p className="text-xs text-green-600">● Online</p>
          </div>
          <button className="w-9 h-9 bg-green-100 text-green-700 rounded-full flex items-center justify-center hover:bg-green-200" data-testid="call-button">
            <Phone size={16} />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-4">
        <div className="max-w-3xl mx-auto space-y-3" data-testid="messages-list">
          <div className="text-center">
            <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">Hari ini</span>
          </div>
          {messages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`} data-testid={`message-${msg.id}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  isUser ? 'bg-green-700 text-white rounded-br-sm' : 'bg-white text-gray-900 shadow-sm rounded-bl-sm'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${isUser ? 'text-green-100' : 'text-gray-500'} text-right`}>
                    {formatTime(msg.created_at)}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-4 lg:px-8 py-3 sticky bottom-0" style={{ zIndex: 1000 }}>
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <button className="p-2 text-gray-500 hover:text-green-700">
            <Paperclip size={20} />
          </button>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ketik pesan..."
            className="flex-1 px-4 py-2 bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-green-700 text-sm"
            data-testid="message-input"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || sending}
            className="w-10 h-10 bg-green-700 text-white rounded-full flex items-center justify-center hover:bg-green-800 transition disabled:bg-gray-300"
            data-testid="send-message-button"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDetailPage;
