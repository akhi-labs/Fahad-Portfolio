'use client';

import type { ReactNode } from 'react';
import { useHeadingStagger } from '@/components/hooks/useHeadingStagger';
import { splitWords } from './splitWords';

type SectionTitleRowProps = {
  lines: string[];
  right?: ReactNode;
};

export function SectionTitleRow({ lines, right }: SectionTitleRowProps) {
  const ref = useHeadingStagger();
  return (
    <div ref={ref} className="section-title-row">
      <h2 className="section-title">
        {lines.map((line) => (
          <span key={line}>{splitWords(line)}</span>
        ))}
      </h2>
      <div data-heading-extra>{right}</div>
    </div>
  );
}
