import React from 'react';
import { Save } from 'lucide-react';

const SMSSettings: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-2xl font-bold mb-6">SMS Provider Settings</h3>

      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-lg mb-4">Twilio Configuration</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Account SID</label>
              <input 
                type="password"
                placeholder="AC..."
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Auth Token</label>
              <input 
                type="password"
                placeholder="Your auth token"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">From Phone Number</label>
              <input 
                type="tel"
                placeholder="+1234567890"
                className="w-full border rounded px-3 py-2"
              />
              <p className="text-xs text-gray-600 mt-1">The phone number messages will be sent from</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-2 pt-4 border-t">
          <button className="flex items-center gap-2 bg-brand-600 text-white px-6 py-2 rounded-lg hover:bg-brand-700 transition-colors">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
          <button className="px-6 py-2 border rounded-lg hover:bg-gray-50">Send Test SMS</button>
        </div>
      </div>
    </div>
  );
};

export default SMSSettings;
