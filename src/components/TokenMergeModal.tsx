import React, { useState, useEffect, useRef } from 'react';
import { X, Copy, Check } from 'lucide-react';

interface TokenMergeModalProps {
  code: string;
  tokens: Record<string, string>;
  onClose: () => void;
}

export function TokenMergeModal({ code, tokens, onClose }: TokenMergeModalProps) {
  const [values, setValues] = useState<Record<string, string>>(tokens);
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const getMergedCode = () => {
    let merged = code;
    Object.entries(values).forEach(([key, value]) => {
      merged = merged.replace(new RegExp(`%%${key}%%`, 'g'), value);
    });
    return merged;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getMergedCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Set Token Values</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-3 mb-4">
          {Object.keys(tokens).map((token) => (
            <div key={token}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {token}
              </label>
              <input
                type="text"
                value={values[token] || ''}
                onChange={(e) => setValues({ ...values, [token]: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder={`Enter value for ${token}`}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
      </div>
    </div>
  );
}
