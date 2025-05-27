import React, { useEffect, useRef, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import Prism from 'prismjs';
// Using okaidia theme as it's dark and generally works well with many language syntaxes.
// Consider moving theme and language imports to a central place like main.tsx or App.tsx if CodeBlock is used extensively,
// to avoid redundant imports and allow for easier theme switching.
import 'prismjs/themes/prism-okaidia.css'; 
import 'prismjs/components/prism-clike'; // Required for javascript, typescript, jsx, tsx and others
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-sql';

interface CodeBlockProps {
  code: string;
  language: string; // Expects a language string compatible with Prism (e.g., "javascript", "python")
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null); // Ref for the <code> element for targeted highlighting
  const timeoutRef = useRef<number>();

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
    // Cleanup timeout on component unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [code, language]); // Rerun highlight when code or language changes

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 2000); // Reset copied state after 2 seconds
    } catch (err) {
      console.error("Failed to copy code: ", err);
      // Optionally, inform the user about the copy failure
    }
  };

  const prismLanguage = `language-${language}`;

  return (
    // Using daisyUI mockup-code for a themed container.
    // The 'my-2' adds vertical margin, 'text-sm' sets a base size for text within.
    <div className="mockup-code my-2 text-sm relative group"> 
      <button
        onClick={handleCopy}
        // Positioned copy button, shows on hover of the parent group.
        className="btn btn-xs btn-ghost absolute top-2 right-2 z-10 opacity-50 group-hover:opacity-100 transition-opacity"
        title="Copy code"
      >
        {copied ? (
          <Check size={16} className="text-success" /> // Green check when copied
        ) : (
          <Copy size={16} /> // Default copy icon, color inherited or use text-neutral-content
        )}
      </button>
      {/* 
        The <pre> element in mockup-code can have data-prefix for line numbers or symbols.
        For actual code highlighting, we avoid data-prefix on the main code <pre>
        to let Prism.js handle line numbers if its line-number plugin were used.
        The okaidia theme itself doesn't add line numbers by default.
      */}
      <pre className={`${prismLanguage} !bg-transparent p-0 overflow-auto`}>
        {/* 
          The `!bg-transparent` is to override any explicit background set by mockup-code's <pre>
          if we want the Prism theme's background to dominate.
          Prism's CSS usually targets `code[class*="language-"]` and `pre[class*="language-"]`.
          Ensure the `code` tag has the correct class for Prism to pick it up.
        */}
        <code ref={codeRef} className={prismLanguage}>
          {code ? code.trim() : ''}
        </code>
      </pre>
    </div>
  );
}
