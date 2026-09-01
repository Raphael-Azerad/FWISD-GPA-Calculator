import type { Metadata } from 'next';

import { InfoPageShell } from '../info-page-shell';

export const metadata: Metadata = {
  title: 'Terms | FWISD GPA and Final Grade Calculator',
  description:
    'Terms and disclaimer for the unofficial FWISD GPA and final grade calculator.',
};

export default function TermsPage() {
  return (
    <InfoPageShell title="Terms and Disclaimer" eyebrow="Use for estimation">
      <p>
        This website is an unofficial student-built tool. It is not an official
        Fort Worth ISD, I.M. Terrell Academy, or FOCUS product.
      </p>
      <p>
        The calculator may contain mistakes, outdated assumptions, incomplete
        policy handling, CSV parsing errors, or edge cases that do not match an
        official transcript. Use it only for learning and estimation.
      </p>
      <p>
        Official GPA, credit, class-rank, transcript, graduation-honors, and
        eligibility decisions are made by Fort Worth ISD and its authorized
        systems and staff.
      </p>
      <p>
        The site is provided as-is, without warranties, guarantees, or liability
        to the fullest extent allowed by law.
      </p>
    </InfoPageShell>
  );
}
