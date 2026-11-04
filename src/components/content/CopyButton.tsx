'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface Props {
  text: string;
  label?: string;
  className?: string;
}

export default function CopyButton({ text, label, className = '' }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy to clipboard"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#151D2B] hover:bg-[#273248] border border-[#273248] text-xs font-medium text-[#9BA8BC] hover:text-white transition-colors ${className}`}
    >
      {copied ? <Check className="w-3.5 h-3.5 text-[#32D583]" /> : <Copy className="w-3.5 h-3.5" />}
      {label && <span>{copied ? 'Copied!' : label}</span>}
    </button>
  );
}
