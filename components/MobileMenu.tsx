import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: { label: string; onClick: () => void; isActive?: boolean }[];
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, items }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Menu */}
      <div className="fixed top-0 left-0 h-screen w-64 bg-white shadow-xl z-50 md:hidden overflow-y-auto">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-bold text-lg">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                item.onClick();
                onClose();
              }}
              className={`w-full text-left p-3 rounded-lg font-medium transition-colors ${
                item.isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};
