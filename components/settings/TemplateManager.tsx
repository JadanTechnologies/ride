import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  type: 'email' | 'sms';
  subject?: string;
  body: string;
  variables: string[];
}

const TemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: 'Welcome Email',
      type: 'email',
      subject: 'Welcome to Keke Napepe!',
      body: 'Hi {{name}}, Welcome to our platform!',
      variables: ['name', 'email']
    },
    {
      id: '2',
      name: 'Ride Confirmation',
      type: 'sms',
      body: 'Your ride {{rideId}} has been confirmed. Driver {{driverName}} will arrive in {{eta}} minutes.',
      variables: ['rideId', 'driverName', 'eta']
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Template>({
    id: '',
    name: '',
    type: 'email',
    subject: '',
    body: '',
    variables: []
  });

  const handleAddNew = () => {
    setFormData({ id: Date.now().toString(), name: '', type: 'email', subject: '', body: '', variables: [] });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (template: Template) => {
    setFormData(template);
    setEditingId(template.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (editingId) {
      setTemplates(prev => prev.map(t => t.id === editingId ? formData : t));
    } else {
      setTemplates(prev => [...prev, formData]);
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">Email & SMS Templates</h3>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Template
        </button>
      </div>

      {/* Template List */}
      <div className="space-y-3 mb-6">
        {templates.map((template) => (
          <div key={template.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold">{template.name}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {template.type === 'email' ? '📧 Email' : '📱 SMS'} • Variables: {template.variables.join(', ')}
                </p>
                <p className="text-sm text-gray-700 mt-2 line-clamp-2">{template.body}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <button 
                  onClick={() => handleEdit(template)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(template.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Template Form */}
      {showForm && (
        <div className="border-t pt-6">
          <h4 className="font-semibold mb-4">{editingId ? 'Edit Template' : 'Create New Template'}</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Template Name</label>
              <input 
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., Welcome Email"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as 'email' | 'sms'})}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
              {formData.type === 'email' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <input 
                    type="text"
                    value={formData.subject || ''}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="Email subject"
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Body (Use {{variable}} syntax)</label>
              <textarea 
                value={formData.body}
                onChange={(e) => setFormData({...formData, body: e.target.value})}
                placeholder="Template body with {{variables}}"
                rows={6}
                className="w-full border rounded px-3 py-2"
              />
              <p className="text-xs text-gray-600 mt-1">Example: Hi {{name}}, your order {{orderId}} is ready!</p>
            </div>
            <div className="flex gap-2 pt-4 border-t">
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 bg-brand-600 text-white px-6 py-2 rounded-lg hover:bg-brand-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                {editingId ? 'Update Template' : 'Create Template'}
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

export default TemplateManager;
