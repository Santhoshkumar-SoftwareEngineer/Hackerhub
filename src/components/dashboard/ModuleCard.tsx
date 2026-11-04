'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  readingTime: number | string;
  isCompleted?: boolean;
  href: string;
  badge?: string;
  accentColor?: string;
}

export default function ModuleCard({
  icon,
  title,
  subtitle,
  readingTime,
  isCompleted = false,
  href,
  badge,
  accentColor = '#7C5CFF',
}: Props) {
  return (
    <div className="group rounded-2xl border border-[#273248] bg-[#0B101A] hover:bg-[#101622] hover:border-[#7C5CFF]/50 p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-lg hover:shadow-2xl">
      <div>
        {/* Top Icon & Status Row */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div
            className="p-3 rounded-xl border border-[#273248] text-[#F4F7FB] transition-colors"
            style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
          >
            {icon}
          </div>

          <div className="flex items-center gap-2">
            {badge && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#151D2B] text-[#00D9FF] border border-[#273248]">
                {badge}
              </span>
            )}
            {isCompleted ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-[#32D583] bg-[#32D583]/10 px-2 py-0.5 rounded-full border border-[#32D583]/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> Completed
              </span>
            ) : (
              <span className="text-[11px] text-[#9BA8BC] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {typeof readingTime === 'number' ? `${readingTime} min` : readingTime}
              </span>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-bold text-[#F4F7FB] group-hover:text-[#00D9FF] transition-colors mb-2">
          {title}
        </h3>
        <p className="text-xs text-[#9BA8BC] leading-relaxed line-clamp-3">
          {subtitle}
        </p>
      </div>

      {/* Bottom Navigation Button */}
      <div className="pt-5 mt-4 border-t border-[#273248]/60 flex items-center justify-between">
        <span className="text-xs font-semibold text-[#9BA8BC] group-hover:text-white transition-colors">
          Explore Section
        </span>
        <Link
          href={href}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#151D2B] group-hover:bg-[#7C5CFF] text-[#9BA8BC] group-hover:text-white transition-colors"
        >
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
