# Investigation: Adding support for Token Variables

**Issue**: #4 (https://github.com/leex279/task-list-advanced/issues/4)
**Type**: ENHANCEMENT
**Investigated**: 2026-02-16T00:00:00Z

### Assessment

| Metric | Value | Reasoning |
|--------|-------|-----------|
| Priority | MEDIUM | Valuable feature requested by contributor with working prototype; not blocking other work but adds significant user value for technical tutorials |
| Complexity | MEDIUM | Requires changes to 4-6 files (types, hooks, components, modal), but follows existing patterns with clear integration points |
| Confidence | HIGH | Contributor has working implementation in fork; codebase patterns are clear and well-understood from exploration |

---

## Problem Statement

Users working through technical task lists often encounter code blocks with placeholder values like `%%username%%` or `%%ip_address%%` that need to be replaced with real values before execution. Currently, users must manually edit copied code, which is error-prone and tedious. This feature would allow task list authors to define token variables (e.g., `%%username%%`) in code blocks, and users to set their values once, automatically replacing all occurrences when copying code.

---

## Analysis

### Change Rationale

The feature enables:
1. Task list authors to write code blocks with semantic placeholders (e.g., `sudo adduser %%username%%`)
2. Users to specify values for all tokens via a modal interface
3. Automatic token replacement when copying code, reducing errors and improving UX
4. Personalized command execution without manual find-and-replace

### Evidence Chain

FEATURE NEED: Technical task lists contain commands with user-specific values
↓ SOLUTION: Token variable system with placeholder syntax `%%tokenName%%`
  Evidence: Issue body describes `%%username%%` → `johndoe` use case

↓ INTEGRATION POINT: CodeBlock component handles copy functionality
  Evidence: `src/components/code/CodeBlock.tsx:23-34` - handleCopy function

↓ DATA STORAGE: Task interface supports codeBlock with language and code
  Evidence: `src/types/task.ts:7-10` - current codeBlock structure

↓ UI PATTERN: Modal system exists for user input collection
  Evidence: `src/components/SaveModal.tsx:1-82` - modal pattern with form inputs

### Affected Files

| File | Lines | Action | Description |
|------|-------|--------|-------------|
| `src/types/task.ts` | 7-10 | UPDATE | Extend codeBlock interface to include tokens field |
| `src/components/TokenMergeModal.tsx` | NEW | CREATE | Modal for entering token values |
| `src/components/code/CodeBlock.tsx` | 10-13, 23-34 | UPDATE | Add tokens prop, show modal on copy if tokens exist |
| `src/hooks/useTasks.ts` | 8-26, 60-72 | UPDATE | Update addTask/editTask to handle tokens |
| `src/components/TaskEditForm.tsx` | 18, 22-30 | UPDATE | Add token detection/editing UI |
| `src/components/TaskDisplay.tsx` | 163-169 | UPDATE | Pass tokens to CodeBlock |
| `src/App.tsx` | 40-50 | UPDATE | Add token modal state (optional approach) |
| `src/utils/storage.ts` | - | NO CHANGE | Already handles JSON serialization properly |

### Integration Points

- `src/components/TaskDisplay.tsx:165-167` renders CodeBlock with task.codeBlock
- `src/hooks/useTasks.ts:21` passes codeBlock to new Task object
- `src/components/TaskEditForm.tsx:84-88` renders CodeBlockEditor for editing
- `src/utils/storage.ts` handles import/export (JSON, no changes needed)
- Database schema may need update for token storage (contributor noted schema change)

### Git History

- **CodeBlock introduced**: `94ac955` - Initial commit
- **Last modified**: `6a7655d` - save
- **Implication**: Core code block functionality is stable, extension is straightforward

---

## Implementation Plan

### Step 1: Extend Task Interface for Token Variables

**File**: `src/types/task.ts`
**Lines**: 7-10
**Action**: UPDATE

**Current code:**
```typescript
  codeBlock?: {
    language: string;
    code: string;
  };
```

**Required change:**
```typescript
  codeBlock?: {
    language: string;
    code: string;
    tokens?: Record<string, string>;  // Token definitions { tokenName: defaultValue }
  };
```

**Why**: Store token definitions alongside code. The `tokens` object maps token names to their default/current values.

---

### Step 2: Create Token Merge Modal Component

**File**: `src/components/TokenMergeModal.tsx`
**Action**: CREATE

**Implementation:**
```typescript
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
```

**Why**: Follows existing SaveModal pattern. Displays form for each token, merges values into code on copy.

---

### Step 3: Update CodeBlock Component

**File**: `src/components/code/CodeBlock.tsx`
**Lines**: 10-13, 23-34
**Action**: UPDATE

**Current code (interface):**
```typescript
interface CodeBlockProps {
  code: string;
  language: string;
}
```

**Required change (interface):**
```typescript
interface CodeBlockProps {
  code: string;
  language: string;
  tokens?: Record<string, string>;
}
```

**Current code (handleCopy):**
```typescript
const handleCopy = async () => {
  await navigator.clipboard.writeText(code);
  setCopied(true);
  // ...
};
```

**Required change (full component with modal state):**
```typescript
export function CodeBlock({ code, language, tokens }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const timeoutRef = useRef<number>();

  // ... existing useEffect ...

  const handleCopy = async () => {
    // If tokens exist, show modal instead of direct copy
    if (tokens && Object.keys(tokens).length > 0) {
      setShowTokenModal(true);
      return;
    }
    await navigator.clipboard.writeText(code);
    setCopied(true);
    // ... existing timeout logic ...
  };

  return (
    <>
      {/* existing JSX */}
      {showTokenModal && (
        <TokenMergeModal
          code={code}
          tokens={tokens}
          onClose={() => setShowTokenModal(false)}
        />
      )}
    </>
  );
}
```

**Why**: Intercepts copy action when tokens exist, shows modal for value entry before copying merged code.

---

### Step 4: Update TaskDisplay to Pass Tokens

**File**: `src/components/TaskDisplay.tsx`
**Lines**: 163-169
**Action**: UPDATE

**Current code:**
```typescript
{task.codeBlock && task.codeBlock.code && (
  <div className="mt-2">
    <CodeBlock
      code={task.codeBlock.code}
      language={task.codeBlock.language}
    />
  </div>
)}
```

**Required change:**
```typescript
{task.codeBlock && task.codeBlock.code && (
  <div className="mt-2">
    <CodeBlock
      code={task.codeBlock.code}
      language={task.codeBlock.language}
      tokens={task.codeBlock.tokens}
    />
  </div>
)}
```

**Why**: Pass tokens from task data to CodeBlock component.

---

### Step 5: Add Token Detection in TaskEditForm

**File**: `src/components/TaskEditForm.tsx`
**Lines**: 18, 22-30
**Action**: UPDATE

**Add token state and detection:**
```typescript
// After line 18
const [tokens, setTokens] = useState<Record<string, string>>(task.codeBlock?.tokens || {});

// Add helper to detect tokens from code
const detectTokens = (code: string): string[] => {
  const matches = code.match(/%%(\w+)%%/g) || [];
  return [...new Set(matches.map(m => m.replace(/%%/g, '')))];
};

// Update handleSave (lines 22-30) to include tokens
const handleSave = () => {
  if (text.trim() || richText.trim()) {
    const detectedTokens = detectTokens(code);
    const updatedTokens: Record<string, string> = {};
    detectedTokens.forEach(t => {
      updatedTokens[t] = tokens[t] || '';
    });

    onSave(
      text.trim(),
      code.trim() ? {
        language: 'javascript',
        code: code.trim(),
        tokens: Object.keys(updatedTokens).length > 0 ? updatedTokens : undefined
      } : undefined,
      richText.trim() ? richText.trim() : undefined,
      optional
    );
  }
};
```

**Why**: Automatically detect `%%tokenName%%` patterns in code and persist token definitions.

---

### Step 6: Update TaskEditForm Props Interface

**File**: `src/components/TaskEditForm.tsx`
**Lines**: 9
**Action**: UPDATE

**Current code:**
```typescript
onSave: (text: string, codeBlock?: { language: string; code: string }, richText?: string, optional?: boolean) => void;
```

**Required change:**
```typescript
onSave: (text: string, codeBlock?: { language: string; code: string; tokens?: Record<string, string> }, richText?: string, optional?: boolean) => void;
```

**Why**: Allow passing tokens through the save callback.

---

### Step 7: Update useTasks Hook

**File**: `src/hooks/useTasks.ts`
**Lines**: 8-26, 60-72
**Action**: UPDATE

**Current addTask signature (line 11):**
```typescript
codeBlock?: { language: string; code: string },
```

**Required change:**
```typescript
codeBlock?: { language: string; code: string; tokens?: Record<string, string> },
```

**Current editTask signature (line 63):**
```typescript
codeBlock?: { language: string; code: string },
```

**Required change:**
```typescript
codeBlock?: { language: string; code: string; tokens?: Record<string, string> },
```

**Why**: Allow token data to flow through task management functions.

---

### Step 8 (Optional): Add Token Editing UI

**File**: `src/components/TaskEditForm.tsx`
**Lines**: After line 88 (after CodeBlockEditor)
**Action**: UPDATE

**Add UI to display/edit detected tokens:**
```typescript
{showCodeInput && detectTokens(code).length > 0 && (
  <div className="mt-2 p-3 bg-gray-50 rounded-md">
    <p className="text-sm font-medium text-gray-700 mb-2">Detected Tokens:</p>
    <div className="flex flex-wrap gap-2">
      {detectTokens(code).map(token => (
        <span key={token} className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded">
          %%{token}%%
        </span>
      ))}
    </div>
  </div>
)}
```

**Why**: Visual feedback showing detected tokens while editing code.

---

## Patterns to Follow

**From codebase - mirror these exactly:**

```typescript
// SOURCE: src/components/SaveModal.tsx:14-27
// Pattern for modal outside-click handling and cleanup
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  inputRef.current?.focus();
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [onClose]);
```

```typescript
// SOURCE: src/components/code/CodeBlock.tsx:36-52
// Pattern for code display with copy button
<div className="relative mt-2 group">
  <pre className="rounded-md bg-gray-50 p-4">
    <code className={`language-${language}`}>{code}</code>
  </pre>
  <button onClick={handleCopy} className="absolute top-2 right-2 ...">
    {copied ? <Check /> : <Copy />}
  </button>
</div>
```

---

## Edge Cases & Risks

| Risk/Edge Case | Mitigation |
|----------------|------------|
| Token syntax in regular code (not a placeholder) | Use specific syntax `%%name%%` that's unlikely to appear naturally |
| Empty token values | Allow empty values; user may want to use code as-is for some tokens |
| Token names with special characters | Regex `\w+` limits to alphanumeric + underscore |
| Large number of tokens | Modal scrolls; consider max token limit in future |
| Existing task lists without tokens | `tokens` field is optional; backward compatible |
| Token value persistence | Values reset each copy; future enhancement could save session values |

---

## Validation

### Automated Checks

```bash
npm run lint
npm run build
# npm test (not currently configured)
```

### Manual Verification

1. Create task with code containing `%%username%%` and `%%ip%%`
2. Verify tokens detected in edit form
3. Save task and view it
4. Click copy button - token modal should appear
5. Enter values and click "Copy Code"
6. Paste in text editor - verify tokens replaced
7. Export task list - verify tokens saved in JSON
8. Import task list - verify tokens preserved

---

## Scope Boundaries

**IN SCOPE:**
- Token variable definition in code blocks (`%%tokenName%%` syntax)
- Token merge modal for entering values
- Automatic token detection from code
- Copy with merged values
- Backward-compatible Task interface extension

**OUT OF SCOPE (do not touch):**
- Database schema changes (contributor's fork handles this separately)
- AI task generation integration
- Rich text token replacement
- Token value persistence across sessions
- Task list-level token definitions (all tokens per-codeblock for now)
- Token syntax customization

---

## Reference Implementation

A working implementation exists in contributor's fork: https://github.com/jerrypena1/task-list-advanced

Note: Contributor mentioned schema changes for token storage. This plan keeps tokens in the codeBlock object within the existing JSONB structure to minimize database changes.

---

## Metadata

- **Investigated by**: Claude
- **Timestamp**: 2026-02-16T00:00:00Z
- **Artifact**: `/home/archon/.archon/workspaces/task-list-advanced/artifacts/runs/4c9765715e0fb2ba01826a2a0d9c0705/investigation.md`
