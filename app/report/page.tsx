import type { Metadata } from 'next';

import { InfoPageShell } from '../info-page-shell';

export const metadata: Metadata = {
  title: 'Report a Mistake | FWISD GPA and Final Grade Calculator',
  description:
    'How to report an anonymized formula, GPA, class-rank, or FOCUS CSV issue.',
};

export default function ReportPage() {
  return (
    <InfoPageShell
      title="Report a Mistake"
      eyebrow="Help improve the calculator"
    >
      <p>
        If the calculator disagrees with FOCUS, class rank, or a public FWISD
        source, report the problem with an anonymized example.
      </p>
      <p>
        Do not post student names, student IDs, exact class rank screenshots,
        raw transcripts, or raw FOCUS CSV exports in a public issue.
      </p>
      <div className="rounded-lg border border-border bg-secondary/50 p-4 text-foreground">
        <p className="font-semibold">Helpful details to include</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
          <li>What calculation looks wrong or confusing.</li>
          <li>What the calculator showed.</li>
          <li>What FOCUS or the official source showed.</li>
          <li>The course type, subject, grade, credit, and GPA points.</li>
          <li>Whether personal details have been removed.</li>
        </ul>
      </div>
      <p>
        The GitHub issue template is already included in the project. Once the
        public repository is live, use the formula report template there so
        fixes can be tracked openly.
      </p>
    </InfoPageShell>
  );
}
