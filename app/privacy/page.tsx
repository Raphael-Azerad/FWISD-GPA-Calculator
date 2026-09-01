import type { Metadata } from 'next';

import { InfoPageShell } from '../info-page-shell';

export const metadata: Metadata = {
  title: 'Privacy | FWISD GPA and Final Grade Calculator',
  description:
    'Privacy notes for the unofficial FWISD GPA and final grade calculator.',
};

export default function PrivacyPage() {
  return (
    <InfoPageShell title="Privacy Policy" eyebrow="Local-first grade tools">
      <p>
        CSV files are parsed in your browser. This project does not create user
        accounts, store uploaded grade files, or send course data to a database
        owned by this project.
      </p>
      <p>
        The hosting provider may keep normal server logs, including page
        requests, browser type, rough location, IP-derived information, and
        error details. Those logs are not used by this project to calculate GPA.
      </p>
      <p>
        Do not upload information you are not comfortable processing in a
        browser-based calculator. Avoid sharing screenshots or CSV exports that
        include names, student IDs, class rank, or transcript data.
      </p>
      <p>
        If this project is published on GitHub, issues and pull requests are
        public by default. Contributors should use anonymized examples only.
      </p>
    </InfoPageShell>
  );
}
