import React from 'react';
import { notFound } from 'next/navigation';
import { MODULES } from '@/data/modules';
import LessonLayout from '@/components/content/LessonLayout';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return MODULES.map((m) => ({
    slug: m.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const mod = MODULES.find((m) => m.slug === slug);
  if (!mod) {
    return {
      title: 'Module Not Found | Vulnerability Assessment',
    };
  }

  return {
    title: `Module ${mod.moduleNumber}: ${mod.title} | Vulnerability Assessment`,
    description: mod.summary,
  };
}

export default async function ModulePage({ params }: Props) {
  const { slug } = await params;
  const mod = MODULES.find((m) => m.slug === slug);

  if (!mod) {
    notFound();
  }

  return <LessonLayout moduleData={mod} />;
}
