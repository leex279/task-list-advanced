interface CodeBlockEditorProps {
  language: string;
  code: string;
  onChange: (language: string, code: string) => void;
}

export function CodeBlockEditor({ language, code, onChange }: CodeBlockEditorProps) {
  return (
    <div className="space-y-2">
      <textarea
        value={code}
        onChange={(e) => onChange('javascript', e.target.value)}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 font-mono"
        rows={5}
        placeholder="Enter your code here..."
      />
    </div>
  );
} 