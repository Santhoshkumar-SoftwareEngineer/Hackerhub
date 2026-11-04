'use client';

import React from 'react';
import { ComparisonTableData } from '@/types/lesson';

interface Props {
  data: ComparisonTableData;
}

export default function ComparisonTable({ data }: Props) {
  return (
    <div className="my-6 space-y-3">
      <div>
        <h4 className="text-sm font-bold text-[#F4F7FB]">{data.title}</h4>
        {data.description && <p className="text-xs text-[#9BA8BC] mt-0.5">{data.description}</p>}
      </div>
      <div className="overflow-x-auto rounded-xl border border-[#273248] bg-[#0B101A]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#101622] text-[#9BA8BC] border-b border-[#273248]">
            <tr>
              {data.columns.map((col) => (
                <th key={col.key} className="p-3.5 font-semibold text-[#F4F7FB]">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#273248]">
            {data.rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-[#151D2B]/50 transition-colors">
                {data.columns.map((col, colIdx) => (
                  <td
                    key={col.key}
                    className={`p-3.5 leading-relaxed ${
                      colIdx === 0
                        ? 'font-semibold text-[#00D9FF]'
                        : 'text-[#9BA8BC]'
                    }`}
                  >
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
