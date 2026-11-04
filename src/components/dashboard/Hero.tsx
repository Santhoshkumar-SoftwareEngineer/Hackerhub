'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Terminal,
  Award,
  Shield,
  ArrowRight,
  Lock,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative rounded-2xl border border-[#273248] bg-gradient-to-br from-[#101622] via-[#0B101A] to-[#151D2B] p-6 md:p-10 overflow-hidden shadow-2xl">
      {/* Subtle background glow effects */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#7C5CFF]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#00D9FF]/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Text & CTAs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFF]/15 border border-[#7C5CFF]/40 text-[#7C5CFF] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#00D9FF]" />
            Enterprise Cybersecurity Learning Platform
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl md:text-5xl font-black text-[#F4F7FB] tracking-tight leading-tight">
              Vulnerability Assessment
            </h1>
            <p className="text-sm md:text-base text-[#9BA8BC] leading-relaxed max-w-xl">
              Learn to identify, analyze, validate, and remediate security weaknesses using industry-recognized cybersecurity methods. Master CVEs, CVSS scoring, security misconfigurations, and false positive elimination.
            </p>
          </div>

          {/* Three CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/modules/introduction"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#7C5CFF] hover:bg-[#6848e8] text-white text-xs md:text-sm font-bold shadow-lg shadow-[#7C5CFF]/30 transition-all hover:scale-[1.02]"
            >
              <BookOpen className="w-4 h-4" /> Start Learning
            </Link>

            <Link
              href="/lab"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#151D2B] hover:bg-[#1c273a] border border-[#273248] text-xs md:text-sm font-semibold text-[#00D9FF] transition-all hover:border-[#00D9FF]/50"
            >
              <Terminal className="w-4 h-4 text-[#32D583]" /> Explore Practical Lab
            </Link>

            <Link
              href="/quiz"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#151D2B] hover:bg-[#1c273a] border border-[#273248] text-xs md:text-sm font-semibold text-[#FFB547] transition-all hover:border-[#FFB547]/50"
            >
              <Award className="w-4 h-4" /> Take the Quiz
            </Link>
          </div>

          {/* Feature highlights bar */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#273248]/60 text-xs text-[#9BA8BC]">
            <div>
              <strong className="text-[#F4F7FB] block text-base font-bold">14</strong>
              <span>Full Lessons</span>
            </div>
            <div>
              <strong className="text-[#00D9FF] block text-base font-bold">6</strong>
              <span>SVG Workflows</span>
            </div>
            <div>
              <strong className="text-[#32D583] block text-base font-bold">100%</strong>
              <span>Offline Local</span>
            </div>
          </div>
        </div>

        {/* Right Column: High-tech Cybersecurity Illustration made from Native SVG */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-sm">
            <svg
              viewBox="0 0 400 360"
              className="w-full h-auto select-none drop-shadow-2xl"
            >
              <defs>
                <linearGradient id="cyber-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7C5CFF" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#00D9FF" stopOpacity="0.8" />
                </linearGradient>
                <radialGradient id="cyber-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#7C5CFF" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#7C5CFF" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Background ambient glow */}
              <circle cx="200" cy="180" r="160" fill="url(#cyber-glow)" />

              {/* Concentric Scanner Rings */}
              <circle cx="200" cy="180" r="140" fill="none" stroke="#273248" strokeWidth="1.5" strokeDasharray="4 8" />
              <circle cx="200" cy="180" r="105" fill="none" stroke="#7C5CFF" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.6" />
              <circle cx="200" cy="180" r="70" fill="none" stroke="#00D9FF" strokeWidth="1.5" strokeDasharray="2 4" opacity="0.8" />

              {/* Rotating radar line indicator */}
              <line x1="200" y1="180" x2="310" y2="100" stroke="#00D9FF" strokeWidth="2" strokeOpacity="0.7" />
              <circle cx="310" cy="100" r="4" fill="#00D9FF" />

              {/* Center Hexagonal Shield */}
              <polygon
                points="200,120 250,150 250,210 200,240 150,210 150,150"
                fill="#151D2B"
                stroke="url(#cyber-grad)"
                strokeWidth="3"
                filter="drop-shadow(0 0 15px rgba(124, 92, 255, 0.5))"
              />

              {/* Inner Shield Lock Icon */}
              <path
                d="M190 175 V165 A10 10 0 0 1 210 165 V175 M184 175 H216 V195 H184 Z"
                fill="none"
                stroke="#F4F7FB"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Satellite Node: CVE */}
              <g transform="translate(60, 80)">
                <rect width="70" height="32" rx="8" fill="#101622" stroke="#7C5CFF" strokeWidth="1.5" />
                <text x="35" y="20" fill="#00D9FF" fontSize="10.5" fontWeight="bold" textAnchor="middle">CVE-2024</text>
              </g>

              {/* Satellite Node: CVSS 9.8 */}
              <g transform="translate(270, 240)">
                <rect width="80" height="32" rx="8" fill="#101622" stroke="#FF4D6D" strokeWidth="1.5" />
                <text x="40" y="20" fill="#FF4D6D" fontSize="10.5" fontWeight="bold" textAnchor="middle">CVSS: 9.8</text>
              </g>

              {/* Satellite Node: VALIDATION */}
              <g transform="translate(60, 250)">
                <rect width="90" height="32" rx="8" fill="#101622" stroke="#32D583" strokeWidth="1.5" />
                <text x="45" y="20" fill="#32D583" fontSize="10.5" fontWeight="bold" textAnchor="middle">VALIDATED</text>
              </g>

              {/* Connecting circuit lines */}
              <path d="M 130 96 L 150 150" stroke="#7C5CFF" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              <path d="M 270 256 L 250 210" stroke="#FF4D6D" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              <path d="M 150 266 L 175 225" stroke="#32D583" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
