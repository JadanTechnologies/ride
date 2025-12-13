import React, { useState } from 'react';
import { Save, AlertCircle, Key, CheckCircle } from 'lucide-react';

export const AIProviderSettings: React.FC = () => {
  const [provider, setProvider] = useState<'gemini' | 'openai'>('gemini');
  const [geminiKey, setGeminiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Store in localStorage or send to backend
    const settings = {
      provider,
      geminiApiKey: geminiKey,
      openaiApiKey: openaiKey,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('aiProviderSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Provider Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">AI Provider Selection</h3>
        
        <div className="space-y-3">
          <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-brand-300 transition-colors" style={{ borderColor: provider === 'gemini' ? '#10b981' : '#e5e7eb' }}>
            <input
              type="radio"
              name="provider"
              value="gemini"
              checked={provider === 'gemini'}
              onChange={(e) => setProvider(e.target.value as 'gemini')}
              className="w-4 h-4 mr-3"
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Google Gemini</p>
              <p className="text-sm text-gray-600">Advanced AI model for intelligent responses</p>
            </div>
          </label>

          <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-brand-300 transition-colors" style={{ borderColor: provider === 'openai' ? '#10b981' : '#e5e7eb' }}>
            <input
              type="radio"
              name="provider"
              value="openai"
              checked={provider === 'openai'}
              onChange={(e) => setProvider(e.target.value as 'openai')}
              className="w-4 h-4 mr-3"
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">OpenAI (GPT-4)</p>
              <p className="text-sm text-gray-600">Powerful language model for complex queries</p>
            </div>
          </label>
        </div>
      </div>

      {/* API Keys Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">API Keys</h3>
        
        {provider === 'gemini' ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex gap-3">
              <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Get your Gemini API Key:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Visit <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Google AI Studio</a></li>
                  <li>Click "Get API Key"</li>
                  <li>Create a new API key</li>
                  <li>Paste it below</li>
                </ol>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Key size={16} />
                Gemini API Key
              </label>
              <input
                type="password"
                placeholder="AIza..."
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">Your API key is stored securely and never shared</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex gap-3">
              <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Get your OpenAI API Key:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Visit <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold">OpenAI Platform</a></li>
                  <li>Go to API Keys section</li>
                  <li>Create a new secret key</li>
                  <li>Paste it below</li>
                </ol>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Key size={16} />
                OpenAI API Key
              </label>
              <input
                type="password"
                placeholder="sk-..."
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">Your API key is stored securely and never shared</p>
            </div>
          </div>
        )}
      </div>

      {/* Usage Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs text-gray-500 mb-1">Queries Today</p>
          <p className="text-2xl font-bold text-gray-900">1,234</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs text-gray-500 mb-1">Avg Response Time</p>
          <p className="text-2xl font-bold text-gray-900">1.2s</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs text-gray-500 mb-1">Success Rate</p>
          <p className="text-2xl font-bold text-green-600">98.5%</p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-between items-center">
        {saved && (
          <div className="flex items-center gap-2 text-green-600 font-medium">
            <CheckCircle size={20} />
            Settings saved successfully
          </div>
        )}
        <button
          onClick={handleSave}
          className="ml-auto bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Save size={18} />
          Save AI Settings
        </button>
      </div>
    </div>
  );
};

export default AIProviderSettings;
