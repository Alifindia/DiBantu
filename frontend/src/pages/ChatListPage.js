import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MessageCircle } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import DesktopNav from '../components/DesktopNav';
import { getConversations } from '../api/api';

const ChatListPage = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await getConversations();
        setConversations(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const formatTime = (s) => {
    const d = new Date(s);
    const now = new Date();
    const diffHrs = (now - d) / (1000 * 60 * 60);
    if (diffHrs < 24) return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    if (diffHrs < 48) return 'Kemarin';
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  const filtered = conversations.filter(c =>
    c.technician_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-12">
      <DesktopNav />
      <header className="lg:hidden bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="lg:hidden p-1 hover:bg-gray-100 rounded-full" data-testid="back-button">
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <h1 className="font-bold text-lg lg:text-2xl text-gray-900">Chat</h1>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <button onClick={() => navigate('/')} className="text-green-700 font-medium text-sm">Kembali ke Beranda</button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-4 lg:py-8">
        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-3 mb-4 lg:mb-6">
          <div className="flex items-center gap-3">
            <Search className="text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari percakapan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-gray-700"
              data-testid="search-chat-input"
            />
          </div>
        </div>

        {/* Conversations */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-2" data-testid="conversations-list">
            {filtered.map(conv => (
              <div
                key={conv.id}
                onClick={() => navigate(`/chat/${conv.id}`)}
                className="bg-white rounded-xl shadow-sm hover:shadow-md p-4 flex items-center gap-3 cursor-pointer transition"
                data-testid={`conversation-${conv.id}`}
              >
                <img src={conv.technician_photo} alt={conv.technician_name} className="w-14 h-14 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-900 truncate">{conv.technician_name}</h3>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{formatTime(conv.last_message_time)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600 truncate flex-1">{conv.last_message || 'Belum ada pesan'}</p>
                    {conv.unread_count > 0 && (
                      <span className="ml-2 bg-green-700 text-white text-xs font-bold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl">
            <MessageCircle size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">Belum ada percakapan</p>
            <p className="text-sm text-gray-400">Pesan dengan teknisi akan muncul di sini</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default ChatListPage;
