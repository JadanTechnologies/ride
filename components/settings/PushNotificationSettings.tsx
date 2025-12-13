import React, { useState } from 'react';
import { Save } from 'lucide-react';

const PushNotificationSettings: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<'onesignal' | 'firebase'>('onesignal');

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-2xl font-bold mb-6">Push Notification Provider Settings</h3>

      <div className="space-y-6">
        {/* Provider Selection */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="push-provider" 
              value="onesignal" 
              checked={selectedProvider === 'onesignal'}
              onChange={(e) => setSelectedProvider(e.target.value as 'onesignal' | 'firebase')}
              className="w-4 h-4"
            />
            <span className="font-medium">OneSignal</span>
            <span className="text-xs text-gray-500">(Recommended)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="push-provider" 
              value="firebase" 
              checked={selectedProvider === 'firebase'}
              onChange={(e) => setSelectedProvider(e.target.value as 'onesignal' | 'firebase')}
              className="w-4 h-4"
            />
            <span className="font-medium">Firebase Cloud Messaging</span>
          </label>
        </div>

        {/* OneSignal Configuration */}
        {selectedProvider === 'onesignal' && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold mb-3">OneSignal Configuration</h4>
            <div>
              <label className="block text-sm font-medium mb-2">App ID</label>
              <input 
                type="text"
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">API Key</label>
              <input 
                type="password"
                placeholder="Your API key"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <p className="text-xs text-gray-600">Get credentials from <a href="#" className="text-blue-600 hover:underline">dashboard.onesignal.com</a></p>
          </div>
        )}

        {/* Firebase Configuration */}
        {selectedProvider === 'firebase' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold mb-3">Firebase Configuration</h4>
            <div>
              <label className="block text-sm font-medium mb-2">Project ID</label>
              <input 
                type="text"
                placeholder="my-project-id"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">API Key</label>
              <input 
                type="password"
                placeholder="Your API key"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Messaging Sender ID</label>
              <input 
                type="text"
                placeholder="123456789"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <p className="text-xs text-gray-600">Get credentials from <a href="#" className="text-blue-600 hover:underline">console.firebase.google.com</a></p>
          </div>
        )}

        {/* Save Button */}
        <div className="flex gap-2 pt-4 border-t">
          <button className="flex items-center gap-2 bg-brand-600 text-white px-6 py-2 rounded-lg hover:bg-brand-700 transition-colors">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PushNotificationSettings;
