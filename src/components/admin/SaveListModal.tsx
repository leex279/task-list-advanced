import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Edit3, PlusCircle } from 'lucide-react'; // Added more icons
import { getTaskLists } from '../../services/taskListService'; // Assuming this service is set up

interface SaveListModalProps {
  onClose: () => void;
  onSave: (nameOrId: string, asExample: boolean, isUpdate: boolean) => Promise<boolean>; // nameOrId can be new name or existing ID
  currentListName?: string; // Optional: pass current list name to prefill for "Save As"
  currentListIsExample?: boolean; // Optional: pass current list's example status
}

export function SaveListModal({ onClose, onSave, currentListName, currentListIsExample }: SaveListModalProps) {
  const [name, setName] = useState(currentListName || ''); // Prefill with current list name if provided
  const [asExample, setAsExample] = useState(currentListIsExample || false);
  const [loading, setLoading] = useState(false);
  const [existingLists, setExistingLists] = useState<{ id: string; name: string }[]>([]);
  const [selectedListId, setSelectedListId] = useState<string>(''); // Store ID for update
  const inputRef = useRef<HTMLInputElement>(null);
  // Removed modalRef and useEffect for handleClickOutside

  useEffect(() => {
    const fetchLists = async () => {
      setLoading(true); // Indicate loading while fetching lists
      try {
        const lists = await getTaskLists();
        setExistingLists(lists.map(list => ({ id: list.id, name: list.name })));
      } catch (error) {
        console.error('Error fetching lists:', error);
        // Optionally, inform user about error fetching lists, though modal might primarily be for saving
      } finally {
        setLoading(false);
      }
    };
    fetchLists();
  }, []);

  useEffect(() => {
    // Focus logic: if updating, don't focus. If creating new, focus.
    if (!selectedListId) {
      inputRef.current?.focus();
    }
  }, [selectedListId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isUpdating = !!selectedListId;
    const listNameToSave = isUpdating ? existingLists.find(l => l.id === selectedListId)?.name : name.trim();

    if (!listNameToSave) {
      alert("List name cannot be empty."); // Basic validation
      return;
    }
    
    setLoading(true);
    try {
      // For updates, pass the ID (which is stored in selectedListId). For new, pass the name.
      const success = await onSave(isUpdating ? selectedListId : listNameToSave, asExample, isUpdating);
      if (success) {
        onClose();
      }
      // Error handling within onSave is expected to be handled by the parent component via onError prop if needed
    } catch (error) {
        // This catch is a fallback if onSave itself throws, though parent should handle specific save errors
        console.error("Error in save operation:", error);
        alert(`An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <dialog id="save_list_modal" className="modal modal-open modal-bottom sm:modal-middle" open>
      <div className="modal-box">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-3 border-b border-base-300">
          <h3 className="text-xl font-bold text-base-content">
            {selectedListId ? 'Update Existing List' : 'Save New Task List'}
          </h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body - Form */}
        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          {existingLists.length > 0 && (
            <div className="form-control">
              <label className="label" htmlFor="existingListSelect">
                <span className="label-text">Update Existing List</span>
                 {selectedListId && (
                    <button
                    type="button"
                    onClick={() => {setSelectedListId(''); setName(currentListName || '');}} // Reset to new or original name
                    className="link link-secondary link-hover text-xs"
                    >
                    Clear selection (Save as New)
                    </button>
                )}
              </label>
              <select
                id="existingListSelect"
                value={selectedListId}
                onChange={(e) => {
                  setSelectedListId(e.target.value);
                  // When an existing list is selected, update name field and potentially 'asExample'
                  const listToUpdate = existingLists.find(l => l.id === e.target.value);
                  if (listToUpdate) {
                    setName(listToUpdate.name); // Reflect selected list's name
                    // setAsExample(listToUpdate.is_example); // Decide if 'asExample' should also update
                  } else {
                     setName(currentListName || ''); // Reset to new if "Select..." is chosen
                  }
                }}
                className="select select-bordered select-primary w-full"
                disabled={loading}
              >
                <option value="">Save as New List...</option>
                {existingLists.map(list => (
                  <option key={list.id} value={list.id}>
                    {list.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-control">
            <label className="label" htmlFor="listNameInput">
              <span className="label-text">{selectedListId ? 'Selected List Name (read-only)' : 'New List Name'}</span>
            </label>
            <input
              ref={inputRef}
              type="text"
              id="listNameInput"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                // If user types a new name, imply they are not updating an existing one from dropdown
                if (selectedListId && e.target.value !== existingLists.find(l=>l.id === selectedListId)?.name) {
                    setSelectedListId(''); 
                }
              }}
              className="input input-bordered input-primary w-full"
              placeholder="e.g., My Project Tasks"
              disabled={loading || !!selectedListId} // Disable if updating an existing list (name comes from select)
              required={!selectedListId} // Required only if creating a new list
            />
          </div>

          <div className="form-control">
            <label className="label cursor-pointer w-max">
              <span className="label-text mr-2">Save as Example List</span>
              <input
                type="checkbox"
                checked={asExample}
                onChange={(e) => setAsExample(e.target.checked)}
                className="toggle toggle-accent"
                disabled={loading}
              />
            </label>
             <p className="text-xs text-base-content/60 mt-1">Example lists are available to all users and typically cannot be modified by non-admins.</p>
          </div>
          
          {/* Modal Actions */}
          <div className="modal-action mt-6">
            <button type="button" onClick={onClose} className="btn btn-ghost" disabled={loading}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || (!name.trim() && !selectedListId)}
            >
              {loading ? <span className="loading loading-spinner loading-sm"></span> : (selectedListId ? <Edit3 size={18} className="mr-2"/> : <Save size={18} className="mr-2"/>)}
              {loading ? 'Saving...' : (selectedListId ? 'Update List' : 'Save New List')}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="submit" onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}