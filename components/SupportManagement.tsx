import React, { useState } from 'react';
import { Send, Plus, Edit2, Trash2, MessageSquare, Bot, AlertCircle } from 'lucide-react';

interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  question: string;
  type: 'chatbot' | 'support';
  status: 'open' | 'answered' | 'escalated';
  createdAt: string;
  response?: string;
  autoReply?: boolean;
}

interface AutoReply {
  id: string;
  keywords: string[];
  response: string;
  category: string;
  isActive: boolean;
}

const mockTickets: SupportTicket[] = [
  {
    id: '1',
    userId: 'u_123',
    userName: 'Chioma Adebayo',
    question: 'How do I reset my password?',
    type: 'chatbot',
    status: 'answered',
    createdAt: '2 hours ago',
    response: 'You can reset your password by clicking on "Forgot Password" on the login page.',
    autoReply: true
  },
  {
    id: '2',
    userId: 'u_456',
    userName: 'John Doe',
    question: 'Why was my account suspended?',
    type: 'chatbot',
    status: 'escalated',
    createdAt: '30 min ago',
    response: 'Your issue has been escalated to our support team. An agent will contact you shortly.'
  },
  {
    id: '3',
    userId: 'd_789',
    userName: 'Ibrahim Musa',
    question: 'How to withdraw earnings?',
    type: 'chatbot',
    status: 'open',
    createdAt: '5 min ago'
  }
];

const mockAutoReplies: AutoReply[] = [
  {
    id: '1',
    keywords: ['password', 'reset', 'forgot'],
    response: 'You can reset your password by clicking on "Forgot Password" on the login page. Follow the instructions sent to your email.',
    category: 'Account',
    isActive: true
  },
  {
    id: '2',
    keywords: ['withdraw', 'earnings', 'payment', 'money'],
    response: 'To withdraw your earnings, go to Wallet > Withdraw. You can set up your bank account and initiate withdrawals.',
    category: 'Finance',
    isActive: true
  },
  {
    id: '3',
    keywords: ['booking', 'ride', 'how to book'],
    response: 'To book a ride: 1) Open the app, 2) Enter your destination, 3) Select vehicle type, 4) Confirm booking.',
    category: 'Ride',
    isActive: true
  }
];

export const SupportManagement: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);
  const [autoReplies, setAutoReplies] = useState<AutoReply[]>(mockAutoReplies);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(tickets[0]);
  const [replyText, setReplyText] = useState('');
  const [showAutoReplyModal, setShowAutoReplyModal] = useState(false);
  const [autoReplyForm, setAutoReplyForm] = useState({ keywords: '', response: '', category: '' });
  const [activeTab, setActiveTab] = useState<'tickets' | 'autoReplies'>('tickets');

  const handleReply = () => {
    if (!replyText.trim() || !selectedTicket) return;

    setTickets(tickets.map(t =>
      t.id === selectedTicket.id
        ? { ...t, response: replyText, status: 'answered', autoReply: false }
        : t
    ));

    setSelectedTicket({
      ...selectedTicket,
      response: replyText,
      status: 'answered'
    });

    setReplyText('');
  };

  const handleEscalate = () => {
    if (!selectedTicket) return;

    setTickets(tickets.map(t =>
      t.id === selectedTicket.id
        ? { ...t, status: 'escalated', response: 'Your issue has been escalated to our support team. An agent will contact you shortly.' }
        : t
    ));

    setSelectedTicket({
      ...selectedTicket,
      status: 'escalated',
      response: 'Your issue has been escalated to our support team. An agent will contact you shortly.'
    });
  };

  const handleAddAutoReply = () => {
    if (!autoReplyForm.keywords || !autoReplyForm.response) {
      alert('Please fill in all fields');
      return;
    }

    const newAutoReply: AutoReply = {
      id: Date.now().toString(),
      keywords: autoReplyForm.keywords.split(',').map(k => k.trim().toLowerCase()),
      response: autoReplyForm.response,
      category: autoReplyForm.category || 'General',
      isActive: true
    };

    setAutoReplies([...autoReplies, newAutoReply]);
    setShowAutoReplyModal(false);
    setAutoReplyForm({ keywords: '', response: '', category: '' });
  };

  const handleDeleteAutoReply = (id: string) => {
    setAutoReplies(autoReplies.filter(ar => ar.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'tickets'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <MessageSquare size={18} />
            Support Tickets
          </div>
        </button>
        <button
          onClick={() => setActiveTab('autoReplies')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'autoReplies'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Bot size={18} />
            Auto-Replies
          </div>
        </button>
      </div>

      {/* Support Tickets Tab */}
      {activeTab === 'tickets' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ticket List */}
          <div className="lg:col-span-1 space-y-2 max-h-96 overflow-y-auto">
            {tickets.map(ticket => (
              <button
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedTicket?.id === ticket.id
                    ? 'bg-brand-50 border-brand-300'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <h4 className="font-semibold text-gray-900 text-sm">{ticket.userName}</h4>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{ticket.question}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs px-2 py-1 rounded font-semibold ${
                    ticket.status === 'open'
                      ? 'bg-red-100 text-red-700'
                      : ticket.status === 'answered'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                  </span>
                  <span className="text-xs text-gray-500">{ticket.createdAt}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Ticket Detail */}
          {selectedTicket && (
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                {/* Question */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare size={16} className="text-brand-600" />
                    <h4 className="font-semibold text-gray-800">Question</h4>
                  </div>
                  <p className="text-gray-700">{selectedTicket.question}</p>
                  <p className="text-xs text-gray-500 mt-2">{selectedTicket.createdAt} • {selectedTicket.userName}</p>
                </div>

                {/* Response */}
                {selectedTicket.response && (
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      {selectedTicket.autoReply ? (
                        <>
                          <Bot size={16} className="text-green-600" />
                          <h4 className="font-semibold text-green-800">Auto-Reply</h4>
                        </>
                      ) : (
                        <>
                          <MessageSquare size={16} className="text-green-600" />
                          <h4 className="font-semibold text-green-800">Agent Response</h4>
                        </>
                      )}
                    </div>
                    <p className="text-gray-700">{selectedTicket.response}</p>
                  </div>
                )}

                {/* Action Buttons */}
                {selectedTicket.status !== 'answered' && !selectedTicket.response && (
                  <div className="space-y-4 pt-4 border-t">
                    {/* Reply Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Response</label>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your response..."
                        rows={4}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={handleReply}
                        className="flex-1 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        <Send size={16} />
                        Send Response
                      </button>
                      <button
                        onClick={handleEscalate}
                        className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        <AlertCircle size={16} />
                        Escalate to Agent
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Auto-Replies Tab */}
      {activeTab === 'autoReplies' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => setShowAutoReplyModal(true)}
              className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Plus size={18} />
              Add Auto-Reply
            </button>
          </div>

          {/* Add Auto-Reply Modal */}
          {showAutoReplyModal && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h4 className="font-bold text-gray-800">Add Auto-Reply</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keywords (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. password, reset, forgot"
                    value={autoReplyForm.keywords}
                    onChange={(e) => setAutoReplyForm({...autoReplyForm, keywords: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Account, Finance, Ride"
                    value={autoReplyForm.category}
                    onChange={(e) => setAutoReplyForm({...autoReplyForm, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Response</label>
                  <textarea
                    placeholder="Type the auto-reply message..."
                    value={autoReplyForm.response}
                    onChange={(e) => setAutoReplyForm({...autoReplyForm, response: e.target.value})}
                    rows={4}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-4 border-t">
                <button
                  onClick={() => setShowAutoReplyModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAutoReply}
                  className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Auto-Reply
                </button>
              </div>
            </div>
          )}

          {/* Auto-Replies List */}
          <div className="space-y-4">
            {autoReplies.map(autoReply => (
              <div key={autoReply.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {autoReply.category}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        autoReply.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {autoReply.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Keywords:</span> {autoReply.keywords.join(', ')}
                    </p>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded">{autoReply.response}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteAutoReply(autoReply.id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportManagement;
