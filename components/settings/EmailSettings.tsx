import React, { useState } from 'react';
import { Save } from 'lucide-react';

const EmailSettings: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<'resend' | 'smtp'>('resend');

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-2xl font-bold mb-6">Email Provider Settings</h3>

      <div className="space-y-6">
        {/* Provider Selection */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="email-provider" 
              value="resend" 
              checked={selectedProvider === 'resend'}
              onChange={(e) => setSelectedProvider(e.target.value as 'resend' | 'smtp')}
              className="w-4 h-4"
            />
            <span className="font-medium">Resend</span>
            <span className="text-xs text-gray-500">(Recommended)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="email-provider" 
              value="smtp" 
              checked={selectedProvider === 'smtp'}
              onChange={(e) => setSelectedProvider(e.target.value as 'resend' | 'smtp')}
              className="w-4 h-4"
            />
            <span className="font-medium">SMTP</span>
          </label>
        </div>

        {/* Resend Configuration */}
        {selectedProvider === 'resend' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold mb-3">Resend Configuration</h4>
            <div>
              <label className="block text-sm font-medium mb-2">API Key</label>
              <input 
                type="password"
                placeholder="re_..."
                className="w-full border rounded px-3 py-2 mb-2"
              />
              <p className="text-xs text-gray-600">Get your API key from <a href="#" className="text-blue-600 hover:underline">dashboard.resend.com</a></p>
            </div>
          </div>
        )}

        {/* SMTP Configuration */}
        {selectedProvider === 'smtp' && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold mb-3">SMTP Configuration</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Host</label>
                <input 
                  type="text"
                  placeholder="smtp.gmail.com"
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Port</label>
                <input 
                  type="number"
                  placeholder="587"
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 mb-3">
                <input type="checkbox" className="w-4 h-4" defaultChecked />
                <span className="text-sm">Use TLS/SSL</span>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input 
                  type="email"
                  placeholder="your-email@example.com"
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input 
                  type="password"
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">From Email Address</label>
              <input 
                type="email"
                placeholder="noreply@kekenapepe.com"
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex gap-2 pt-4 border-t">
          <button className="flex items-center gap-2 bg-brand-600 text-white px-6 py-2 rounded-lg hover:bg-brand-700 transition-colors">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
          <button className="px-6 py-2 border rounded-lg hover:bg-gray-50">Test Configuration</button>
        </div>
      </div>
    </div>
  );
};

export default EmailSettings;
