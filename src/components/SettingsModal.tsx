import React, { useState } from 'react';
import { X, ExternalLink, LogIn, LogOut } from 'lucide-react';
import { ChatHistory } from './ChatHistory';
import { ImportExamplesButton } from './admin/ImportExamplesButton';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface SettingsModalProps {
  onClose: () => void;
  onSave: (settings: {
    service: string;
    model: string;
    googleApiKey: string;
  }) => void;
  initialSettings: {
    service: string;
    model: string;
    googleApiKey: string;
  };
  isAdmin?: boolean;
  user: User | null;
  onShowAuth: () => void;
}

export function SettingsModal({ onClose, onSave, initialSettings, isAdmin, user, onShowAuth }: SettingsModalProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [clearing, setClearing] = useState(false);

  const clearSiteData = async () => {
    setClearing(true);
    try {
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(";").forEach(cookie => {
        document.cookie = cookie
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
      });
      const databases = await window.indexedDB.databases();
      databases.forEach(db => {
        if (db.name) window.indexedDB.deleteDatabase(db.name);
      });
      if ('caches' in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map(key => caches.delete(key)));
      }
      window.location.reload();
    } catch (error) {
      console.error('Error clearing site data:', error);
    } finally {
      setClearing(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      onClose();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-black/50 transition-opacity" />
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-modal transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200">
            <h3 className="text-lg font-semibold text-surface-900">Settings</h3>
            <button
              onClick={onClose}
              className="p-1 text-surface-400 hover:text-surface-600 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            {/* Authentication Section */}
            <div className="mb-6 pb-6 border-b border-surface-200">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-surface-900">Account</h4>
                {user ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-surface-600">{user.email}</span>
                    <button
                      onClick={handleSignOut}
                      className="btn btn-ghost text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 text-sm"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={onShowAuth}
                    className="btn btn-ghost text-primary-600 hover:text-primary-700 px-3 py-1 text-sm"
                  >
                    <LogIn size={16} />
                    Sign In
                  </button>
                )}
              </div>
            </div>

            {/* Google API Key Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Google API Key
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={settings.googleApiKey || ''}
                  onChange={(e) => setSettings({ ...settings, googleApiKey: e.target.value })}
                  className="flex-1 px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  placeholder="Enter your API key"
                />
                <button
                  onClick={() => window.open('https://makersuite.google.com/app/apikey', '_blank')}
                  className="btn btn-secondary whitespace-nowrap"
                  title="Get Google API Key"
                >
                  Get API Key
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>

            {/* Admin Section */}
            {isAdmin && (
              <div className="mb-6 pb-6 border-b border-surface-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-surface-900">Admin Tools</h4>
                  <div className="text-xs text-surface-500 px-2 py-1 bg-surface-100 rounded">Admin Access</div>
                </div>
                <div className="space-y-4">
                  <div className="bg-surface-50 p-4 rounded-lg border border-surface-200">
                    <h5 className="text-sm font-medium text-surface-700 mb-2">Example Lists</h5>
                    <p className="text-xs text-surface-600 mb-3">
                      Import example task lists into the database. These lists will be available to all users.
                    </p>
                    <ImportExamplesButton
                      onSuccess={() => {
                        alert('Example lists imported successfully!');
                      }}
                      onError={(error) => {
                        alert(error);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Clear Site Data Section */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-surface-900 mb-2">Clear Site Data</h4>
              <p className="text-sm text-surface-500 mb-4">
                This will clear all saved settings, tasks, and cached data. This action cannot be undone.
              </p>
              <button
                onClick={clearSiteData}
                disabled={clearing}
                className="btn border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
              >
                {clearing ? 'Clearing...' : 'Clear All Data'}
              </button>
            </div>

            <ChatHistory onClose={onClose} />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 px-6 py-4 border-t border-surface-200 bg-surface-50">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onSave(settings)}
              className="btn btn-primary"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
