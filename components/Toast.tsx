import React, { useEffect } from 'react';
import { X, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { AppNotification } from '../types';

interface ToastProps {
  notifications: AppNotification[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ notifications, onDismiss }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] flex flex-col gap-2 w-full max-w-sm px-4">
      {notifications.map((note) => (
        <ToastItem key={note.id} note={note} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ note: AppNotification; onDismiss: (id: string) => void }> = ({ note, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(note.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [note.id, onDismiss]);

  const styles = {
    info: 'bg-blue-600 text-white',
    success: 'bg-green-600 text-white',
    alert: 'bg-red-600 text-white'
  };

  const icons = {
    info: <Info size={18} />,
    success: <CheckCircle size={18} />,
    alert: <AlertTriangle size={18} />
  };

  return (
    <div className={`${styles[note.type]} p-4 rounded-lg shadow-lg flex items-start gap-3 animate-in slide-in-from-top-2 fade-in duration-300`}>
      <div className="mt-0.5">{icons[note.type]}</div>
      <div className="flex-1 text-sm font-medium">{note.message}</div>
      <button onClick={() => onDismiss(note.id)} className="opacity-80 hover:opacity-100">
        <X size={16} />
      </button>
    </div>
  );
};