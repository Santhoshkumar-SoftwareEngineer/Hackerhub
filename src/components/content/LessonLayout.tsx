'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ModuleData } from '@/types/lesson';
import { MODULES } from '@/data/modules';
import { WORKFLOWS } from '@/data/workflows';
import {
  getCompletedModules,
  toggleModuleCompleted,
  getBookmarks,
  toggleBookmark,
  setLastVisitedModule,
} from '@/lib/storage';
import TableOfContents from './TableOfContents';
import ComparisonTable from './ComparisonTable';
import KnowledgeCheck from './KnowledgeCheck';
import ModuleNotes from './ModuleNotes';
import CopyButton from './CopyButton';
import CiaTriadSvg from './CiaTriadSvg';
import InteractiveWorkflow from '@/components/workflows/InteractiveWorkflow';
import CvssCalculator from '@/components/cvss/CvssCalculator';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import {
  Clock,
  CheckCircle2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Share2,
  Sparkles,
} from 'lucide-react';

interface Props {
  moduleData: ModuleData;
}

export default function LessonLayout({ moduleData }: Props) {
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  useEffect(() => {
    setLastVisitedModule(moduleData.slug);
    setIsCompleted(getCompletedModules().includes(moduleData.slug));
    setIsBookmarked(getBookmarks().includes(moduleData.slug));
  }, [moduleData.slug]);

  const handleToggleComplete = () => {
    const updated = toggleModuleCompleted(moduleData.slug);
    setIsCompleted(updated);
  };

  const handleToggleBookmark = () => {
    const updated = toggleBookmark(moduleData.slug);
    setIsBookmarked(updated);
  };

  // Previous and Next module navigation
  const currentIndex = MODULES.findIndex((m) => m.slug === moduleData.slug);
  const prevModule = currentIndex > 0 ? MODULES[currentIndex - 1] : null;
  const nextModule = currentIndex < MODULES.length - 1 ? MODULES[currentIndex + 1] : null;

  const associatedWorkflow = moduleData.workflowId ? WORKFLOWS[moduleData.workflowId] : null;

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Modules', href: '/' },
          { label: `Module ${moduleData.moduleNumber}: ${moduleData.shortTitle}` },
        ]}
      />

      {/* Module Title & Hero Card */}
      <div className="rounded-2xl border border-[#273248] bg-gradient-to-br from-[#101622] via-[#0B101A] to-[#151D2B] p-6 md:p-8 relative overflow-hidden shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#00D9FF] bg-[#101622] px-3 py-1 rounded-full border border-[#273248] uppercase tracking-wider">
              Module {moduleData.moduleNumber}
            </span>
            <span className="text-xs font-semibold text-[#7C5CFF] bg-[#7C5CFF]/15 px-3 py-1 rounded-full border border-[#7C5CFF]/30">
              {moduleData.category}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleBookmark}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                isBookmarked
                  ? 'bg-[#00D9FF]/15 text-[#00D9FF] border-[#00D9FF]/40'
                  : 'bg-[#151D2B] text-[#9BA8BC] border-[#273248] hover:text-white'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
              <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

            <button
              onClick={handleToggleComplete}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                isCompleted
                  ? 'bg-[#32D583]/20 text-[#32D583] border-[#32D583]/50'
                  : 'bg-[#7C5CFF] hover:bg-[#6848e8] text-white border-[#7C5CFF] shadow-md shadow-[#7C5CFF]/20'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
            </button>
          </div>
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold text-[#F4F7FB] tracking-tight mb-2">
          {moduleData.title}
        </h1>
        <p className="text-sm md:text-base text-[#9BA8BC] max-w-3xl leading-relaxed mb-4">
          {moduleData.subtitle}
        </p>

        <div className="flex items-center gap-4 text-xs text-[#9BA8BC] pt-4 border-t border-[#273248]/50">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#00D9FF]" /> Estimated: {moduleData.estimatedMinutes} minutes
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-[#7C5CFF]" /> {moduleData.sections.length} core sections
          </span>
        </div>
      </div>

      {/* Main Content Layout with 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Lesson Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Executive Summary Callout */}
          <div className="p-4 rounded-xl border border-[#7C5CFF]/40 bg-[#7C5CFF]/10 text-xs text-[#F4F7FB] leading-relaxed flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-[#7C5CFF] shrink-0 mt-0.5" />
            <div>
              <strong className="block text-[#00D9FF] mb-0.5">Lesson Focus & Objectives:</strong>
              {moduleData.summary}
            </div>
          </div>

          {/* Module-Specific Embedded Workflows & Tools */}
          {moduleData.slug === 'introduction' && <CiaTriadSvg />}
          {moduleData.slug === 'cvss-scoring' && <CvssCalculator />}

          {/* Interactive SVG Workflow if associated */}
          {associatedWorkflow && (
            <div className="my-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#00D9FF]">
                  Interactive Workflow Diagram
                </span>
                <span className="text-[11px] text-[#9BA8BC]">Drag nodes to inspect & reorganize</span>
              </div>
              <InteractiveWorkflow workflow={associatedWorkflow} />
            </div>
          )}

          {/* Detailed Sections */}
          <div className="space-y-10">
            {moduleData.sections.map((section) => (
              <section key={section.id} id={section.id} className="space-y-4 scroll-mt-24">
                <h2 className="text-xl md:text-2xl font-bold text-[#F4F7FB] border-b border-[#273248] pb-2">
                  {section.title}
                </h2>

                {/* Section Content Paragraphs */}
                <div className="text-xs md:text-sm text-[#9BA8BC] leading-relaxed space-y-3 whitespace-pre-line">
                  {section.content}
                </div>

                {/* Key Takeaways Box */}
                {section.keyTakeaways && section.keyTakeaways.length > 0 && (
                  <div className="p-4 rounded-xl border border-[#32D583]/30 bg-[#32D583]/5 space-y-1.5">
                    <span className="text-xs font-bold text-[#32D583] uppercase tracking-wider block">
                      Key Takeaways:
                    </span>
                    <ul className="text-xs text-[#F4F7FB] space-y-1 list-disc list-inside">
                      {section.keyTakeaways.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Practical Observations Box */}
                {section.practicalObservations && section.practicalObservations.length > 0 && (
                  <div className="p-4 rounded-xl border border-[#FFB547]/30 bg-[#FFB547]/5 space-y-1.5">
                    <span className="text-xs font-bold text-[#FFB547] uppercase tracking-wider block">
                      Field Observations from the SOC / Pen-Test Lab:
                    </span>
                    <ul className="text-xs text-[#F4F7FB] space-y-1 list-disc list-inside">
                      {section.practicalObservations.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Comparison Tables */}
          {moduleData.comparisonTables &&
            moduleData.comparisonTables.map((tbl, idx) => (
              <ComparisonTable key={idx} data={tbl} />
            ))}

          {/* Knowledge Check */}
          {moduleData.knowledgeCheck && (
            <KnowledgeCheck data={moduleData.knowledgeCheck} />
          )}

          {/* External References List */}
          {moduleData.externalLinks && moduleData.externalLinks.length > 0 && (
            <div className="p-5 rounded-xl border border-[#273248] bg-[#0B101A] space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#00D9FF]">
                Official Resources & Standards
              </h4>
              <div className="space-y-2">
                {moduleData.externalLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-[#101622] hover:bg-[#151D2B] border border-[#273248] hover:border-[#7C5CFF]/40 flex items-center justify-between transition-colors group block"
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#F4F7FB] group-hover:text-[#7C5CFF] flex items-center gap-1.5">
                        {link.title} <ExternalLink className="w-3 h-3 text-[#9BA8BC]" />
                      </div>
                      <p className="text-[11px] text-[#9BA8BC] mt-0.5">{link.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Previous / Next Module Navigation */}
          <div className="pt-6 border-t border-[#273248] flex flex-wrap items-center justify-between gap-4">
            {prevModule ? (
              <Link
                href={`/modules/${prevModule.slug}`}
                className="flex items-center gap-2 p-3 rounded-xl bg-[#0B101A] hover:bg-[#151D2B] border border-[#273248] text-xs font-medium text-[#9BA8BC] hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-[#7C5CFF]" />
                <div className="text-left">
                  <div className="text-[10px] text-[#627189] uppercase">Previous Lesson</div>
                  <div className="font-semibold text-[#F4F7FB]">{prevModule.shortTitle}</div>
                </div>
              </Link>
            ) : <div />}

            {nextModule ? (
              <Link
                href={`/modules/${nextModule.slug}`}
                className="flex items-center gap-2 p-3 rounded-xl bg-[#0B101A] hover:bg-[#151D2B] border border-[#273248] text-xs font-medium text-[#9BA8BC] hover:text-white transition-colors"
              >
                <div className="text-right">
                  <div className="text-[10px] text-[#627189] uppercase">Next Lesson</div>
                  <div className="font-semibold text-[#F4F7FB]">{nextModule.shortTitle}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#00D9FF]" />
              </Link>
            ) : (
              <Link
                href="/quiz"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#7C5CFF] hover:bg-[#6848e8] text-white text-xs font-bold transition-all shadow-lg shadow-[#7C5CFF]/30"
              >
                Ready for the Final Quiz <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Right Sticky Sidebar Column: TOC & Personal Notes */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <TableOfContents
            sections={moduleData.sections.map((s) => ({ id: s.id, title: s.title }))}
          />
          <ModuleNotes moduleSlug={moduleData.slug} />
        </div>
      </div>
    </div>
  );
}
