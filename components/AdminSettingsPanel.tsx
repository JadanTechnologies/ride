import React, { useState } from 'react';
import { Settings, User, CreditCard, Mail, Bell, Lock, Users, Globe, Zap, Bot } from 'lucide-react';
import BrandingSettings from './settings/BrandingSettings.tsx';
import PaymentSettings from './settings/PaymentSettings.tsx';
import EmailSettings from './settings/EmailSettings.tsx';
import SMSSettings from './settings/SMSSettings.tsx';
import PushNotificationSettings from './settings/PushNotificationSettings.tsx';
import TemplateManager from './settings/TemplateManager.tsx';
import StaffManagement from './settings/StaffManagement.tsx';
import AccessControlSettings from './settings/AccessControlSettings.tsx';
import AIProviderSettings from './settings/AIProviderSettings.tsx';

import { Pricing, CommissionRates } from '../types';

type SettingTab = 'branding' | 'payment' | 'email' | 'sms' | 'push' | 'templates' | 'staff' | 'access' | 'monetization' | 'ai';

interface AdminSettingsPanelProps {
  currentPricing: Pricing;
  onUpdatePricing: (pricing: Pricing) => void;
  currentCommission: CommissionRates;
  onUpdateCommission: (rates: CommissionRates) => void;
  currentSurge: number;
  onUpdateSurge: (surge: number) => void;
}

export const AdminSettingsPanel: React.FC<AdminSettingsPanelProps> = ({
  currentCommission,
  onUpdateCommission,
  currentPricing,
  onUpdatePricing,
  currentSurge,
  onUpdateSurge,
}) => {
  const [activeTab, setActiveTab] = useState<SettingTab>('branding');

  const tabs = [
    { id: 'branding' as SettingTab, label: 'Branding', icon: Globe },
    { id: 'payment' as SettingTab, label: 'Payment', icon: CreditCard },
    { id: 'email' as SettingTab, label: 'Email', icon: Mail },
    { id: 'sms' as SettingTab, label: 'SMS', icon: Bell },
    { id: 'push' as SettingTab, label: 'Push Notifications', icon: Bell },
    { id: 'templates' as SettingTab, label: 'Templates', icon: Settings },
    { id: 'staff' as SettingTab, label: 'Staff', icon: Users },
    { id: 'access' as SettingTab, label: 'Access Control', icon: Lock },
    { id: 'monetization' as SettingTab, label: 'Monetization', icon: CreditCard },
    { id: 'ai' as SettingTab, label: 'AI Providers', icon: Bot },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-brand-600 flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Admin Settings
          </h2>
        </div>
        <nav className="space-y-2 p-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-brand-100 text-brand-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {activeTab === 'branding' && <BrandingSettings />}
          {activeTab === 'payment' && <PaymentSettings />}
          {activeTab === 'email' && <EmailSettings />}
          {activeTab === 'sms' && <SMSSettings />}
          {activeTab === 'push' && <PushNotificationSettings />}
          {activeTab === 'templates' && <TemplateManager />}
          {activeTab === 'staff' && <StaffManagement />}
          {activeTab === 'access' && <AccessControlSettings />}
          {activeTab === 'monetization' && <MonetizationSettings 
            currentCommission={currentCommission}
            onUpdateCommission={onUpdateCommission}
          />}
          {activeTab === 'ai' && <AIProviderSettings />}
        </div>
      </div>
    </div>
  );
};

const MonetizationSettings: React.FC<{
  currentCommission: CommissionRates,
  onUpdateCommission: (rates: CommissionRates) => void;
}> = ({ currentCommission, onUpdateCommission }) => {
  const [commission, setCommission] = useState(currentCommission);

  const handleCommissionChange = (key: keyof CommissionRates, value: string) => {
    setCommission(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  const handleSaveChanges = () => {
    onUpdateCommission(commission);
    // Optionally add a notification here to inform the user that settings are saved.
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-2xl font-bold mb-4">Monetization Settings</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <input type="checkbox" id="enable-monetization" className="w-4 h-4" defaultChecked />
          <label htmlFor="enable-monetization" className="text-lg">Enable Platform Monetization (Commission, Surge Pricing, etc.)</label>
        </div>
        <div className="border-t pt-4 mt-4">
          <h4 className="font-semibold mb-2">Commission Settings</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ride Commission (%)</label>
              <input 
                type="number" 
                value={commission.ride}
                onChange={(e) => handleCommissionChange('ride', e.target.value)}
                placeholder="10" 
                min="0" 
                max="100" 
                className="w-full border rounded px-3 py-2" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Logistics Commission (%)</label>
              <input 
                type="number" 
                value={commission.logistics}
                onChange={(e) => handleCommissionChange('logistics', e.target.value)}
                placeholder="15" 
                min="0" 
                max="100" 
                className="w-full border rounded px-3 py-2" 
              />
            </div>
          </div>
        </div>
        <div className="border-t pt-4 mt-4 flex justify-end">
          <button 
            onClick={handleSaveChanges}
            className="bg-brand-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPanel;
