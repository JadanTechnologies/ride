import React, { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';

interface AccessControl {
  id: string;
  name: string;
  type: 'region' | 'ip' | 'device' | 'os' | 'country';
  rules: string[];
  isRestriction: boolean;
  isActive: boolean;
}

const AccessControlSettings: React.FC = () => {
  const [controls, setControls] = useState<AccessControl[]>([
    {
      id: '1',
      name: 'Nigeria Only',
      type: 'country',
      rules: ['NG'],
      isRestriction: false,
      isActive: true
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<AccessControl>({
    id: '',
    name: '',
    type: 'region',
    rules: [],
    isRestriction: false,
    isActive: true
  });

  const handleAddNew = () => {
    setFormData({
      id: Date.now().toString(),
      name: '',
      type: 'region',
      rules: [],
      isRestriction: false,
      isActive: true
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (formData.id && controls.find(c => c.id === formData.id)) {
      setControls(prev => prev.map(c => c.id === formData.id ? formData : c));
    } else {
      setControls(prev => [...prev, {...formData, id: Date.now().toString()}]);
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setControls(prev => prev.filter(c => c.id !== id));
  };

  const handleAddRule = () => {
    setFormData({...formData, rules: [...formData.rules, '']});
  };

  const handleUpdateRule = (index: number, value: string) => {
    const newRules = [...formData.rules];
    newRules[index] = value;
    setFormData({...formData, rules: newRules});
  };

  const handleRemoveRule = (index: number) => {
    setFormData({...formData, rules: formData.rules.filter((_, i) => i !== index)});
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">Platform Access Control</h3>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Access Control
        </button>
      </div>

      {/* Access Controls List */}
      <div className="space-y-3 mb-6">
        {controls.map((control) => (
          <div key={control.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold">{control.name}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Type: <span className="font-medium">{control.type}</span> • 
                  Mode: <span className="font-medium">{control.isRestriction ? 'Blacklist' : 'Whitelist'}</span>
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {control.rules.map((rule, idx) => (
                    <span key={idx} className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">{rule}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={control.isActive}
                    onChange={(e) => {
                      setControls(prev => prev.map(c => c.id === control.id ? {...c, isActive: e.target.checked} : c));
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Active</span>
                </label>
                <button 
                  onClick={() => handleDelete(control.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="border-t pt-6">
          <h4 className="font-semibold mb-4">Create Access Control Rule</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Control Name</label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Nigeria Only"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Control Type</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="region">Region</option>
                  <option value="ip">IP Address</option>
                  <option value="device">Device</option>
                  <option value="os">Operating System</option>
                  <option value="country">Country</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mode</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input 
                    type="radio"
                    name="mode"
                    value="whitelist"
                    checked={!formData.isRestriction}
                    onChange={() => setFormData({...formData, isRestriction: false})}
                    className="w-4 h-4"
                  />
                  <span>Whitelist (Only allow listed values)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="radio"
                    name="mode"
                    value="blacklist"
                    checked={formData.isRestriction}
                    onChange={() => setFormData({...formData, isRestriction: true})}
                    className="w-4 h-4"
                  />
                  <span>Blacklist (Block listed values)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Rules</label>
              <div className="space-y-2">
                {formData.rules.map((rule, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      type="text"
                      value={rule}
                      onChange={(e) => handleUpdateRule(idx, e.target.value)}
                      placeholder={`Enter ${formData.type} value...`}
                      className="flex-1 border rounded px-3 py-2 text-sm"
                    />
                    <button 
                      onClick={() => handleRemoveRule(idx)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button 
                onClick={handleAddRule}
                className="mt-2 px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
              >
                + Add Rule
              </button>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 bg-brand-600 text-white px-6 py-2 rounded-lg hover:bg-brand-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Control
              </button>
              <button 
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessControlSettings;
