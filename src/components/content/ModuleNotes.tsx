'use client';

import React, { useState, useEffect } from 'react';
import { getModuleNote, saveModuleNote } from '@/lib/storage';
import { Edit3, Check, Save } from 'lucide-react';

interface Props {
  moduleSlug: string;
}

export default function ModuleNotes({ moduleSlug }: Props) {
  const [note, setNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setNote(getModuleNote(moduleSlug));
  }, [moduleSlug]);

  const handleSave = () => {
    saveModuleNote(moduleSlug, note);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="p-4 rounded-xl border border-[#273248] bg-[#0B101A] space-y-2.5">
      <div className="flex items-center justify-between border-b border-[#273248] pb-2">
        <span className="text-xs font-bold text-[#F4F7FB] flex items-center gap-1.5 uppercase tracking-wider">
          <Edit3 className="w-3.5 h-3.5 text-[#00D9FF]" /> Personal Module Notes
        </span>
        <button
          onClick={handleSave}
          className="flex items-center gap-1 text-[11px] font-semibold text-[#7C5CFF] hover:text-[#00D9FF] transition-colors"
        >
          {isSaved ? (
            <span className="flex items-center gap-1 text-[#32D583]">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Save className="w-3.5 h-3.5" /> Save Note
            </span>
          )}
        </button>
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Record key findings, CVE references, or personal thoughts on this lesson (saved locally)..."
        rows={3}
        className="w-full text-xs bg-[#101622] border border-[#273248] rounded-lg p-2.5 text-[#F4F7FB] placeholder-[#627189] focus:outline-none focus:border-[#7C5CFF] resize-y"
      />
    </div>
  );
}
