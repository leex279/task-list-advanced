import React, { useState } from 'react';
import { X, ExternalLink, LogIn, LogOut } from 'lucide-react';
import { ChatHistory } from './ChatHistory'; // Assuming ChatHistory will be styled or is independent
import { ImportExamplesButton } from './admin/ImportExamplesButton'; // Assuming ImportExamplesButton will be styled
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
    if (!confirm('Are you sure you want to clear all site data? This action cannot be undone.')) {
      return;
    }
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
      alert(`Error clearing site data: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setClearing(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      onClose(); // Close modal after sign out
    } catch (error) {
      console.error('Error signing out:', error);
      alert(`Error signing out: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Use a dialog element for the modal
  return (
    <dialog id="settings_modal" className="modal modal-open modal-bottom sm:modal-middle" open>
      <div className="modal-box">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Settings</h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X size={20} />
          </button>
        </div>

        {/* Authentication Section */}
        <div className="mb-6 pb-6 border-b border-base-300">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">Account</h4>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm opacity-75">{user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="btn btn-outline btn-error btn-sm"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => { onClose(); onShowAuth(); }} // Close settings to show auth
                className="btn btn-outline btn-primary btn-sm"
              >
                <LogIn size={16} />
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Google API Key Section */}
        <div className="mb-4 form-control">
          <label className="label">
            <span className="label-text font-semibold">Google API Key</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="password"
              value={settings.googleApiKey || ''}
              onChange={(e) => setSettings({ ...settings, googleApiKey: e.target.value })}
              className="input input-bordered input-primary flex-1"
              placeholder="Enter your API key"
            />
            <a
              href="https://makersuite.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-accent btn-sm whitespace-nowrap"
              title="Get Google API Key"
            >
              Get API Key
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Admin Section */}
        {isAdmin && (
          <div className="mt-8 pt-6 border-t border-base-300">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Admin Tools</h4>
              <div className="badge badge-neutral">Admin Access</div>
            </div>
            <div className="space-y-4">
              <div className="card bg-base-200 p-4 rounded-lg">
                <h5 className="card-title text-md">Example Lists</h5>
                <p className="text-sm opacity-75 mb-3">
                  Import example task lists into the database. These lists will be available to all users.
                </p>
                <div className="card-actions">
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
          </div>
        )}

        {/* Clear Site Data Section */}
        <div className="mt-8 pt-6 border-t border-base-300">
          <h4 className="text-lg font-semibold mb-2">Clear Site Data</h4>
          <p className="text-sm opacity-75 mb-4">
            This will clear all saved settings, tasks, and cached data. This action cannot be undone.
          </p>
          <button
            onClick={clearSiteData}
            disabled={clearing}
            className="btn btn-error btn-outline"
          >
            {clearing ? <span className="loading loading-spinner"></span> : null}
            {clearing ? 'Clearing...' : 'Clear All Data'}
          </button>
        </div>

        {/* Chat History - Assuming it's part of the settings or a separate component to be included */}
        {/* <ChatHistory onClose={onClose} /> */}

        <div className="modal-action mt-6">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => { onSave(settings); onClose(); }} // Save and then close
            className="btn btn-primary"
          >
            Save Settings
          </button>
        </div>
      </div>
      {/* Clicking outside closes the modal */}
      <form method="dialog" className="modal-backdrop">
        <button type="submit">close</button>
      </form>
    </dialog>
  );
}