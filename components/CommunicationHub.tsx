import React, { useState } from 'react';
import { Send, Search, Clock } from 'lucide-react';

interface Message {
  id: string;
  from: 'user' | 'admin';
  type: 'chat' | 'sms';
  senderName: string;
  userId: string;
  content: string;
  timestamp: number;
  isRead: boolean;
}

interface User {
  id: string;
  name: string;
  type: 'chat' | 'sms';
}

export const CommunicationHub: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      from: 'user',
      type: 'chat',
      senderName: 'Chioma O.',
      userId: 'user_123',
      content: 'Hi, where is my driver?',
      timestamp: Date.now() - 300000,
      isRead: false
    },
    {
      id: '2',
      from: 'user',
      type: 'sms',
      senderName: 'Tunde A.',
      userId: 'user_456',
      content: 'Can I get a receipt for my ride?',
      timestamp: Date.now() - 600000,
      isRead: false
    }
  ]);

  const [selectedUserId, setSelectedUserId] = useState<string>('user_123');
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedConversation = messages.filter(m => m.userId === selectedUserId);
  const uniqueUsers = Array.from(new Map(
    messages.map(m => [m.userId, { id: m.userId, name: m.senderName, type: m.type }])
  ).values()) as User[];

  const handleSendReply = (type: 'chat' | 'sms') => {
    if (!replyText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      from: 'admin',
      type,
      senderName: 'Support Team',
      userId: selectedUserId,
      content: replyText,
      timestamp: Date.now(),
      isRead: true
    };

    setMessages(prev => [...prev, newMessage]);
    setReplyText('');
  };

  const filteredUsers = uniqueUsers.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Conversation List */}
      <div className="w-80 bg-white shadow-lg flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold mb-3">Communications</h2>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map(user => {
            const unread = messages.filter(m => m.userId === user.id && !m.isRead && m.from === 'user').length;
            const lastMsg = messages.filter(m => m.userId === user.id).sort((a, b) => b.timestamp - a.timestamp)[0];
            
            return (
              <button
                key={user.id}
                onClick={() => setSelectedUserId(user.id)}
                className={`w-full p-4 border-b hover:bg-gray-50 transition-colors text-left ${
                  selectedUserId === user.id ? 'bg-brand-50 border-l-4 border-l-brand-600' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold">{user.name}</h4>
                    <p className="text-xs text-gray-500">{user.type === 'chat' ? '💬 Chat' : '📱 SMS'}</p>
                    <p className="text-sm text-gray-600 truncate mt-1">{lastMsg?.content}</p>
                  </div>
                  {unread > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unread}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat View */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="p-4 border-b">
          {selectedConversation.length > 0 && (
            <div>
              <h3 className="font-bold">{selectedConversation[0].senderName}</h3>
              <p className="text-xs text-gray-500">{selectedConversation[0].type === 'chat' ? '💬 Chat Conversation' : '📱 SMS Conversation'}</p>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {selectedConversation.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Select a conversation to view messages</p>
            </div>
          ) : (
            selectedConversation.map(msg => (
              <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.from === 'user' 
                    ? 'bg-gray-100 text-gray-900 rounded-bl-none' 
                    : 'bg-brand-600 text-white rounded-br-none'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        {selectedConversation.length > 0 && (
          <div className="p-4 border-t space-y-3">
            <div className="flex gap-2">
              <input 
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendReply(selectedConversation[0].type);
                  }
                }}
                placeholder="Type your response..."
                className="flex-1 border rounded-lg px-4 py-2 resize-none"
                rows={1}
              />
              <div className="flex gap-2">
                {selectedConversation[0].type === 'chat' && (
                  <button 
                    onClick={() => handleSendReply('chat')}
                    className="bg-brand-600 text-white p-3 rounded-lg hover:bg-brand-700 transition-colors"
                    title="Send Chat Reply"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
                {selectedConversation[0].type === 'sms' && (
                  <button 
                    onClick={() => handleSendReply('sms')}
                    className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors"
                    title="Send SMS Reply"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500">You're replying via {selectedConversation[0].type === 'chat' ? 'Chat' : 'SMS'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunicationHub;
