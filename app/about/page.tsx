import type { Metadata } from 'next';

import { InfoPageShell } from '../info-page-shell';

export const metadata: Metadata = {
  title: 'About | FWISD GPA and Final Grade Calculator',
  description:
    'About the unofficial student-built FWISD GPA and final grade calculator.',
};

export default function AboutPage() {
  return (
    <InfoPageShell title="About This Project" eyebrow="Unofficial calculator">
      <p>
        This site was built by an FWISD student to make GPA, class-rank GPA,
        FOCUS CSV exports, and final-grade math easier to understand.
      </p>
      <p>
        The project is intentionally simple: enter grades manually, import a
        FOCUS-style CSV, review which courses count, and see the math behind the
        estimate. It does not connect to FWISD, FOCUS, or any student record
        system.
      </p>
      <p>
        The formulas are based on public FWISD guidance for the 2026-2027 school
        year and sample FOCUS export behavior reviewed during development. When
        the app has to infer a subject, tier, or GPA status from a generic CSV,
        it makes a best-effort guess that students should review.
      </p>
      <p>
        Official GPA, transcript, rank, credit, and honors decisions are always
        made by Fort Worth ISD.
      </p>
    </InfoPageShell>
  );
}
