'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: Props) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-[#9BA8BC] mb-6 flex-wrap">
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-[#00D9FF] transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Dashboard</span>
      </Link>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;

        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 text-[#627189]" />
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-[#00D9FF] transition-colors truncate max-w-[200px]">
                {item.label}
              </Link>
            ) : (
              <span className="text-[#F4F7FB] font-medium truncate max-w-[240px]">{item.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
