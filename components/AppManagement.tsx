import React, { useState } from 'react';
import { Upload, Download, Trash2, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface AppVersion {
  id: string;
  version: string;
  buildNumber: number;
  releaseDate: string;
  minAndroidVersion: string;
  minIOSVersion: string;
  features: string[];
  downloadUrl: string;
  size: string;
  downloads: number;
  status: 'active' | 'beta' | 'deprecated';
}

const mockVersions: AppVersion[] = [
  {
    id: '1',
    version: '2.1.0',
    buildNumber: 2100,
    releaseDate: 'Dec 13, 2025',
    minAndroidVersion: '9.0',
    minIOSVersion: '12.0',
    features: ['Enhanced UI', 'Better performance', 'Bug fixes', 'Dark mode'],
    downloadUrl: '/downloads/keke-2.1.0.apk',
    size: '45 MB',
    downloads: 15234,
    status: 'active'
  },
  {
    id: '2',
    version: '2.0.5',
    buildNumber: 2050,
    releaseDate: 'Dec 5, 2025',
    minAndroidVersion: '8.0',
    minIOSVersion: '11.0',
    features: ['Payment improvements', 'Support chat'],
    downloadUrl: '/downloads/keke-2.0.5.apk',
    size: '42 MB',
    downloads: 8932,
    status: 'beta'
  },
  {
    id: '3',
    version: '2.0.0',
    buildNumber: 2000,
    releaseDate: 'Nov 28, 2025',
    minAndroidVersion: '8.0',
    minIOSVersion: '11.0',
    features: ['Initial release'],
    downloadUrl: '/downloads/keke-2.0.0.apk',
    size: '40 MB',
    downloads: 5000,
    status: 'deprecated'
  }
];

export const AppManagement: React.FC = () => {
  const [versions, setVersions] = useState<AppVersion[]>(mockVersions);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    version: '',
    buildNumber: '',
    minAndroidVersion: '',
    minIOSVersion: '',
    features: '',
  });

  const handleUpload = () => {
    if (!uploadForm.version || !uploadForm.buildNumber) {
      alert('Please fill in all required fields');
      return;
    }

    const newVersion: AppVersion = {
      id: Date.now().toString(),
      version: uploadForm.version,
      buildNumber: parseInt(uploadForm.buildNumber),
      releaseDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      minAndroidVersion: uploadForm.minAndroidVersion || '8.0',
      minIOSVersion: uploadForm.minIOSVersion || '11.0',
      features: uploadForm.features.split(',').map(f => f.trim()),
      downloadUrl: `/downloads/keke-${uploadForm.version}.apk`,
      size: '~45 MB',
      downloads: 0,
      status: 'beta'
    };

    setVersions([newVersion, ...versions]);
    setShowUploadModal(false);
    setUploadForm({ version: '', buildNumber: '', minAndroidVersion: '', minIOSVersion: '', features: '' });
  };

  const handleDelete = (id: string) => {
    setVersions(versions.filter(v => v.id !== id));
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><CheckCircle size={14} /> Active</span>;
      case 'beta':
        return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><Clock size={14} /> Beta</span>;
      case 'deprecated':
        return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">Deprecated</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Application Management</h3>
          <p className="text-sm text-gray-500">Manage app versions and APK distributions</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Upload size={18} />
          Upload New Version
        </button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h4 className="font-bold text-gray-800">Upload New App Version</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Version *</label>
              <input
                type="text"
                placeholder="e.g. 2.2.0"
                value={uploadForm.version}
                onChange={(e) => setUploadForm({...uploadForm, version: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Build Number *</label>
              <input
                type="number"
                placeholder="e.g. 2200"
                value={uploadForm.buildNumber}
                onChange={(e) => setUploadForm({...uploadForm, buildNumber: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Android Version</label>
              <input
                type="text"
                placeholder="e.g. 8.0"
                value={uploadForm.minAndroidVersion}
                onChange={(e) => setUploadForm({...uploadForm, minAndroidVersion: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min iOS Version</label>
              <input
                type="text"
                placeholder="e.g. 11.0"
                value={uploadForm.minIOSVersion}
                onChange={(e) => setUploadForm({...uploadForm, minIOSVersion: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma-separated)</label>
              <input
                type="text"
                placeholder="e.g. New UI, Performance, Bug fixes"
                value={uploadForm.features}
                onChange={(e) => setUploadForm({...uploadForm, features: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-4 border-t">
            <button
              onClick={() => setShowUploadModal(false)}
              className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium flex items-center gap-2"
            >
              <Upload size={16} />
              Upload Version
            </button>
          </div>
        </div>
      )}

      {/* Versions List */}
      <div className="space-y-4">
        {versions.map(version => (
          <div key={version.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-bold text-gray-900">v{version.version}</h4>
                  {getStatusBadge(version.status)}
                </div>
                <p className="text-sm text-gray-500">Build #{version.buildNumber} • Released {version.releaseDate}</p>
              </div>
              <button
                onClick={() => handleDelete(version.id)}
                className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">File Size</p>
                <p className="font-semibold text-gray-900">{version.size}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Downloads</p>
                <p className="font-semibold text-gray-900">{version.downloads.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Min Android</p>
                <p className="font-semibold text-gray-900">{version.minAndroidVersion}+</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Min iOS</p>
                <p className="font-semibold text-gray-900">{version.minIOSVersion}+</p>
              </div>
            </div>

            {version.features.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Features</p>
                <div className="flex flex-wrap gap-2">
                  {version.features.map((feature, idx) => (
                    <span key={idx} className="bg-brand-50 text-brand-700 px-2 py-1 rounded text-xs font-medium">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <a
                href={version.downloadUrl}
                className="flex-1 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Download size={16} />
                Download APK
              </a>
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
                Copy Link
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppManagement;
