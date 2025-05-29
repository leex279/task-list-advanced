import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { getTaskLists } from '../../services/taskListService';

interface SaveListModalProps {
  onClose: () => void;
  onSave: (name: string, asExample: boolean) => Promise<boolean>;
}

export function SaveListModal({ onClose, onSave }: SaveListModalProps) {
  const [name, setName] = useState('');
  const [asExample, setAsExample] = useState(false);
  const [loading, setLoading] = useState(false);
  const [existingLists, setExistingLists] = useState<{ id: string; name: string }[]>([]);
  const [selectedList, setSelectedList] = useState<string>('');
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const lists = await getTaskLists();
        setExistingLists(lists.map(list => ({ id: list.id, name: list.name })));
      } catch (error) {
        console.error('Error fetching lists:', error);
      }
    };

    fetchLists();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    if (!selectedList) {
      inputRef.current?.focus();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, selectedList]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!name.trim() && !selectedList)) return;

    setLoading(true);
    try {
      const success = await onSave(selectedList ? selectedList : name.trim(), asExample);
      if (success) {
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Save Task List</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {existingLists.length > 0 && (
            <div className="mb-4">
              <label htmlFor="existingList" className="block text-sm font-medium text-gray-700 mb-2">
                Update Existing List
              </label>
              <select
                id="existingList"
                value={selectedList}
                onChange={(e) => {
                  setSelectedList(e.target.value);
                  if (e.target.value) {
                    setName('');
                  }
                }}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-magenta-500"
              >
                <option value="">Select a list to update...</option>
                {existingLists.map(list => (
                  <option key={list.id} value={list.name}>
                    {list.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                New List Name
              </label>
              {selectedList && (
                <button
                  type="button"
                  onClick={() => setSelectedList('')}
                  className="text-sm text-magenta-500 hover:text-magenta-600"
                >
                  Create New Instead
                </button>
              )}
            </div>
            <input
              ref={inputRef}
              type="text"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value) {
                  setSelectedList('');
                }
              }}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-magenta-500 disabled:bg-gray-100"
              placeholder="Enter a name for your task list"
              disabled={!!selectedList}
              required={!selectedList}
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={asExample}
                onChange={(e) => setAsExample(e.target.checked)}
                className="w-4 h-4 text-magenta-500 border-gray-300 rounded focus:ring-magenta-500"
              />
              <span className="text-sm text-gray-700">Save as example list (available to all users)</span>
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-magenta-500 text-white rounded-md hover:bg-magenta-600 disabled:opacity-50"
              disabled={loading || (!name.trim() && !selectedList)}
            >
              {loading ? 'Saving...' : (selectedList ? 'Update' : 'Save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}