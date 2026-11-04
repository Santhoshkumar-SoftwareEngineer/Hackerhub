'use client';

import React, { useEffect, useState } from 'react';
import { List, ChevronRight } from 'lucide-react';

interface SectionLink {
  id: string;
  title: string;
}

interface Props {
  sections: SectionLink[];
}

export default function TableOfContents({ sections }: Props) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveId(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: 'smooth' });
      setActiveId(id);
    }
  };

  return (
    <nav className="p-4 rounded-xl border border-[#273248] bg-[#0B101A] space-y-2.5">
      <div className="flex items-center gap-2 text-xs font-bold text-[#F4F7FB] uppercase tracking-wider pb-2 border-b border-[#273248]">
        <List className="w-4 h-4 text-[#7C5CFF]" />
        <span>Table of Contents</span>
      </div>
      <ul className="space-y-1 text-xs">
        {sections.map((sec) => {
          const isActive = activeId === sec.id;
          return (
            <li key={sec.id}>
              <a
                href={`#${sec.id}`}
                onClick={(e) => scrollToSection(e, sec.id)}
                className={`flex items-center gap-1.5 py-1 px-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-[#00D9FF] bg-[#151D2B] font-medium'
                    : 'text-[#9BA8BC] hover:text-[#F4F7FB] hover:bg-[#101622]'
                }`}
              >
                <ChevronRight className={`w-3 h-3 ${isActive ? 'text-[#00D9FF]' : 'text-transparent'}`} />
                <span className="truncate">{sec.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
