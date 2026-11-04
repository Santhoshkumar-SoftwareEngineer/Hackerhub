'use client';

import React, { useState } from 'react';
import { Shield, Lock, CheckCircle, Activity, Info } from 'lucide-react';

export default function CiaTriadSvg() {
  const [activePillar, setActivePillar] = useState<'confidentiality' | 'integrity' | 'availability' | null>('confidentiality');

  const pillarDetails = {
    confidentiality: {
      title: 'Confidentiality',
      color: '#7C5CFF',
      role: 'Preventing unauthorized disclosure',
      description: 'Ensuring that sensitive information is accessible only to those authorized to have access.',
      vulnerabilities: ['SQL Injection leaking database contents', 'Insecure direct object references (IDOR)', 'Missing authentication on API endpoints', 'Publicly accessible S3 buckets / storage'],
      controls: ['AES-256 encryption at rest', 'TLS 1.3 in transit', 'Multi-factor authentication (MFA)', 'Least privilege access control (RBAC)'],
    },
    integrity: {
      title: 'Integrity',
      color: '#00D9FF',
      role: 'Preventing unauthorized modification',
      description: 'Guarding against improper information modification or destruction, ensuring system data authenticity.',
      vulnerabilities: ['Cross-Site Scripting (XSS) altering DOM or session tokens', 'Insecure deserialization modifying object state', 'Tampering with log files or financial records', 'Man-in-the-Middle (MitM) data modification'],
      controls: ['Cryptographic SHA-256 hashing', 'Digital signatures', 'Immutable append-only audit logging', 'Strict input validation and output encoding'],
    },
    availability: {
      title: 'Availability',
      color: '#32D583',
      role: 'Preventing unauthorized disruption of access',
      description: 'Ensuring timely and reliable access to and use of information, infrastructure, and business applications.',
      vulnerabilities: ['Denial of Service (DoS) crashing service daemons', 'Ransomware encrypting file systems', 'Resource exhaustion via unconstrained file uploads', 'Hardware power or link failure without redundancy'],
      controls: ['Redundant load balancing clusters', 'Automated cloud auto-scaling', 'Geographically distributed offline backups', 'Rate limiting and DDoS mitigation services'],
    },
  };

  const current = activePillar ? pillarDetails[activePillar] : pillarDetails.confidentiality;

  return (
    <div className="rounded-xl border border-[#273248] bg-[#0B101A] p-6 my-6 space-y-6">
      <div className="flex items-center justify-between border-b border-[#273248] pb-3">
        <div>
          <h4 className="text-sm font-bold text-[#F4F7FB] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#7C5CFF]" /> Interactive CIA Triad Model
          </h4>
          <p className="text-xs text-[#9BA8BC]">Click any apex of the triangle to explore security impacts and controls</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Native SVG CIA Triad Diagram */}
        <div className="flex justify-center">
          <svg viewBox="0 0 360 320" className="w-full max-w-[320px] select-none">
            {/* Center Triangle Fill */}
            <polygon
              points="180,45 60,265 300,265"
              fill="#101622"
              stroke="#273248"
              strokeWidth="2"
            />

            {/* Inner Shield Center */}
            <circle cx="180" cy="180" r="36" fill="#151D2B" stroke="#7C5CFF" strokeWidth="2" strokeDasharray="3 3" />
            <text x="180" y="184" fill="#F4F7FB" fontSize="11" fontWeight="bold" textAnchor="middle">
              SECURITY
            </text>

            {/* Connecting lines from center to apexes */}
            <line x1="180" y1="180" x2="180" y2="45" stroke="#7C5CFF" strokeWidth="2" strokeOpacity="0.5" />
            <line x1="180" y1="180" x2="60" y2="265" stroke="#00D9FF" strokeWidth="2" strokeOpacity="0.5" />
            <line x1="180" y1="180" x2="300" y2="265" stroke="#32D583" strokeWidth="2" strokeOpacity="0.5" />

            {/* Top Node: Confidentiality */}
            <g
              onClick={() => setActivePillar('confidentiality')}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <circle
                cx="180"
                cy="45"
                r="34"
                fill={activePillar === 'confidentiality' ? '#7C5CFF' : '#151D2B'}
                stroke="#7C5CFF"
                strokeWidth="2.5"
                filter={activePillar === 'confidentiality' ? 'drop-shadow(0 0 10px rgba(124, 92, 255, 0.6))' : 'none'}
              />
              <text x="180" y="49" fill="#F4F7FB" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                CONFIDENTIALITY
              </text>
            </g>

            {/* Bottom Left Node: Integrity */}
            <g
              onClick={() => setActivePillar('integrity')}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <circle
                cx="60"
                cy="265"
                r="34"
                fill={activePillar === 'integrity' ? '#00D9FF' : '#151D2B'}
                stroke="#00D9FF"
                strokeWidth="2.5"
                filter={activePillar === 'integrity' ? 'drop-shadow(0 0 10px rgba(0, 217, 255, 0.6))' : 'none'}
              />
              <text
                x="60"
                y="269"
                fill={activePillar === 'integrity' ? '#080B12' : '#F4F7FB'}
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
              >
                INTEGRITY
              </text>
            </g>

            {/* Bottom Right Node: Availability */}
            <g
              onClick={() => setActivePillar('availability')}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <circle
                cx="300"
                cy="265"
                r="34"
                fill={activePillar === 'availability' ? '#32D583' : '#151D2B'}
                stroke="#32D583"
                strokeWidth="2.5"
                filter={activePillar === 'availability' ? 'drop-shadow(0 0 10px rgba(50, 213, 131, 0.6))' : 'none'}
              />
              <text
                x="300"
                y="269"
                fill={activePillar === 'availability' ? '#080B12' : '#F4F7FB'}
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
              >
                AVAILABILITY
              </text>
            </g>
          </svg>
        </div>

        {/* Selected Pillar Detail Card */}
        <div className="p-5 rounded-xl bg-[#101622] border border-[#273248] space-y-3">
          <div className="flex items-center justify-between">
            <span
              className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded"
              style={{ backgroundColor: `${current.color}20`, color: current.color }}
            >
              {current.title}
            </span>
            <span className="text-xs text-[#9BA8BC] font-medium">{current.role}</span>
          </div>

          <p className="text-xs text-[#F4F7FB] leading-relaxed">{current.description}</p>

          <div>
            <span className="text-[11px] font-bold text-[#FF4D6D] uppercase tracking-wider block mb-1">
              Common Threat Vectors / Vulnerabilities:
            </span>
            <ul className="text-xs text-[#9BA8BC] space-y-1 list-disc list-inside">
              {current.vulnerabilities.map((v, i) => (
                <li key={i}>{v}</li>
              ))}
            </ul>
          </div>

          <div className="pt-2 border-t border-[#273248]">
            <span className="text-[11px] font-bold text-[#32D583] uppercase tracking-wider block mb-1">
              Defensive Safeguards & Controls:
            </span>
            <ul className="text-xs text-[#9BA8BC] space-y-1 list-disc list-inside">
              {current.controls.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
