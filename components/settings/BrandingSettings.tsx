import React, { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';

const BrandingSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    platformName: 'Keke Napepe',
    contactEmail: 'support@kekenapepe.com',
    contactPhone: '+234 XXX XXX XXXX',
    supportUrl: 'https://support.kekenapepe.com',
    primaryColor: '#10b981',
    secondaryColor: '#059669',
  });

  const handleChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Save to backend
    console.log('Saving branding settings:', settings);
    alert('Branding settings saved successfully!');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-2xl font-bold mb-6">Branding Settings</h3>
      
      <div className="space-y-6">
        {/* Logo & Favicon */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Logo (URL)</label>
            <input 
              type="url" 
              placeholder="https://..." 
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              defaultValue="https://via.placeholder.com/200x50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Favicon (URL)</label>
            <input 
              type="url" 
              placeholder="https://..." 
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Platform Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Platform Name</label>
          <input 
            type="text" 
            value={settings.platformName}
            onChange={(e) => handleChange('platformName', e.target.value)}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Support Email</label>
            <input 
              type="email" 
              value={settings.contactEmail}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Support Phone</label>
            <input 
              type="tel" 
              value={settings.contactPhone}
              onChange={(e) => handleChange('contactPhone', e.target.value)}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* URLs */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Support URL</label>
            <input 
              type="url" 
              value={settings.supportUrl}
              onChange={(e) => handleChange('supportUrl', e.target.value)}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Privacy Policy URL</label>
            <input 
              type="url" 
              placeholder="https://..." 
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Terms & Conditions URL</label>
            <input 
              type="url" 
              placeholder="https://..." 
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Primary Color</label>
            <div className="flex gap-2">
              <input 
                type="color" 
                value={settings.primaryColor}
                onChange={(e) => handleChange('primaryColor', e.target.value)}
                className="w-12 h-10 rounded border cursor-pointer"
              />
              <input 
                type="text" 
                value={settings.primaryColor}
                onChange={(e) => handleChange('primaryColor', e.target.value)}
                className="flex-1 border rounded px-3 py-2 font-mono text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Secondary Color</label>
            <div className="flex gap-2">
              <input 
                type="color" 
                value={settings.secondaryColor}
                onChange={(e) => handleChange('secondaryColor', e.target.value)}
                className="w-12 h-10 rounded border cursor-pointer"
              />
              <input 
                type="text" 
                value={settings.secondaryColor}
                onChange={(e) => handleChange('secondaryColor', e.target.value)}
                className="flex-1 border rounded px-3 py-2 font-mono text-sm"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-2 pt-4 border-t">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-brand-600 text-white px-6 py-2 rounded-lg hover:bg-brand-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
          <button className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandingSettings;
