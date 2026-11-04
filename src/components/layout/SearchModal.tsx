'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MODULES } from '@/data/modules';
import { WORKFLOWS } from '@/data/workflows';
import { Search, X, BookOpen, Workflow, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedModules = q
    ? MODULES.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.subtitle.toLowerCase().includes(q) ||
          m.summary.toLowerCase().includes(q) ||
          m.sections.some((s) => s.title.toLowerCase().includes(q) || s.content.toLowerCase().includes(q))
      )
    : [];

  const matchedWorkflows = q
    ? Object.values(WORKFLOWS).filter(
        (w) =>
          w.title.toLowerCase().includes(q) ||
          w.subtitle.toLowerCase().includes(q) ||
          w.description.toLowerCase().includes(q) ||
          w.defaultNodes.some((n) => n.label.toLowerCase().includes(q) || n.description.toLowerCase().includes(q))
      )
    : [];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4">
      <div className="w-full max-w-xl bg-[#151D2B] border border-[#273248] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Search input header */}
        <div className="flex items-center gap-3 p-4 border-b border-[#273248] bg-[#101622]">
          <Search className="w-5 h-5 text-[#7C5CFF]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search CVEs, CVSS, validation, misconfigurations, tools..."
            className="flex-1 bg-transparent text-sm text-[#F4F7FB] placeholder-[#627189] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#9BA8BC] hover:text-white hover:bg-[#151D2B]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results area */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {q.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#9BA8BC]">
              <p>Type keywords to search all 14 educational modules, interactive SVG workflows, and tools.</p>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {['Log4Shell', 'CVSS Calculator', 'False Positive', 'Juice Shop', 'HSTS Header'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="px-2.5 py-1 rounded-lg bg-[#101622] hover:bg-[#273248] border border-[#273248] text-[11px] text-[#00D9FF]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : matchedModules.length === 0 && matchedWorkflows.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#9BA8BC]">
              No results found for &ldquo;<span className="text-[#F4F7FB]">{query}</span>&rdquo;. Try searching for &ldquo;CVE&rdquo;, &ldquo;CVSS&rdquo;, or &ldquo;Nmap&rdquo;.
            </div>
          ) : (
            <>
              {matchedModules.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#7C5CFF] px-1">
                    Modules ({matchedModules.length})
                  </div>
                  {matchedModules.map((m) => (
                    <Link
                      key={m.id}
                      href={`/modules/${m.slug}`}
                      onClick={onClose}
                      className="p-3 rounded-xl bg-[#101622] hover:bg-[#1c273a] border border-[#273248] block transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-[#00D9FF]" />
                          <h4 className="text-xs font-semibold text-[#F4F7FB] group-hover:text-[#7C5CFF] transition-colors">
                            Module {m.moduleNumber}: {m.title}
                          </h4>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#9BA8BC] group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <p className="text-[11px] text-[#9BA8BC] mt-1 line-clamp-1">{m.subtitle}</p>
                    </Link>
                  ))}
                </div>
              )}

              {matchedWorkflows.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#273248]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#00D9FF] px-1">
                    Interactive Workflows ({matchedWorkflows.length})
                  </div>
                  {matchedWorkflows.map((w) => (
                    <Link
                      key={w.id}
                      href="/workflows"
                      onClick={onClose}
                      className="p-3 rounded-xl bg-[#101622] hover:bg-[#1c273a] border border-[#273248] block transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Workflow className="w-4 h-4 text-[#7C5CFF]" />
                          <h4 className="text-xs font-semibold text-[#F4F7FB] group-hover:text-[#00D9FF] transition-colors">
                            {w.title}
                          </h4>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#9BA8BC] group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <p className="text-[11px] text-[#9BA8BC] mt-1 line-clamp-1">{w.subtitle}</p>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
