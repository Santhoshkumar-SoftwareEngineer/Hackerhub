'use client';

import React from 'react';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import QuizEngine from '@/components/quiz/QuizEngine';
import { Award, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function QuizPage() {
  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      <Breadcrumbs
        items={[
          { label: 'Final Knowledge Quiz' },
        ]}
      />

      <QuizEngine />
    </div>
  );
}
